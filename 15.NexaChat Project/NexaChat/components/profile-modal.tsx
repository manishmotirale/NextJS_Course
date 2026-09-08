"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon, Loader2Icon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile } from "@/modules/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const getUserInitials = (name?: string | null, email?: string | null) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
};

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Sync state when user changes
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || "");
      setImageUrl(user?.image || "");
      setImagePreview(user?.image || "");
    }
  }, [isOpen, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateUserProfile({
        name: name.trim(),
        image: imageUrl || undefined,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated!");
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.refresh();
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setImagePreview("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-border/80 bg-card">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Edit Profile</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update your display name and profile photo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={imagePreview} alt={name} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                  {getUserInitials(name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change photo"
              >
                <CameraIcon className="h-5 w-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7 px-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon className="h-3 w-3 mr-1.5" />
                Change Photo
              </Button>
              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-3 text-destructive hover:text-destructive"
                  onClick={handleRemovePhoto}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Name field */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs font-medium">
              Display Name
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="pl-8 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Email (read-only)
            </Label>
            <Input
              value={user?.email || ""}
              disabled
              className="text-sm text-muted-foreground bg-muted/50 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2Icon className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

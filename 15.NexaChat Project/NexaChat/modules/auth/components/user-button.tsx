// modules/auth/components/user-button.tsx
"use client";

import { useState } from "react";
import { LogOut, Settings, CreditCard, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserButtonProps {
  user: any;
  onLogout?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
  onBilling?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  showEmail?: boolean;
  showMemberSince?: boolean;
}

export default function UserButton({
  user,
  onLogout,
  onSettings,
  onProfile,
  onBilling,
  showBadge = false,
  badgeText = "Pro",
  badgeVariant = "default",
  size = "sm",
  showEmail = true,
  showMemberSince = false,
}: UserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await onSignOut();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const avatarSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full shrink-0">
        <div
          className={`relative ${avatarSizes[size]} rounded-full cursor-pointer hover:opacity-90 transition-opacity`}
        >
          <Avatar className={avatarSizes[size]}>
            <AvatarImage
              src={user.image || ""}
              alt={user.name || "User avatar"}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {getUserInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          {showBadge && (
            <Badge
              variant={badgeVariant}
              className="absolute -bottom-1 -right-1 h-4 px-1 text-[9px] font-extrabold"
            >
              {badgeText}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 border-border/80" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex items-center space-x-2.5">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User avatar"}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getUserInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 min-w-0">
                <p className="text-xs font-semibold leading-none truncate text-foreground">
                  {user.name || "User"}
                </p>
                {showEmail && user.email && (
                  <p className="text-[11px] leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {onProfile && (
            <DropdownMenuItem
              onClick={onProfile}
              className="cursor-pointer text-xs"
            >
              <UserIcon className="mr-2 h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
          )}
          {onBilling && (
            <DropdownMenuItem
              onClick={onBilling}
              className="cursor-pointer text-xs"
            >
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              Billing
            </DropdownMenuItem>
          )}
          {onSettings && (
            <DropdownMenuItem
              onClick={onSettings}
              className="cursor-pointer text-xs"
            >
              <Settings className="mr-2 h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer text-destructive focus:text-destructive text-xs font-medium"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          {isLoading ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

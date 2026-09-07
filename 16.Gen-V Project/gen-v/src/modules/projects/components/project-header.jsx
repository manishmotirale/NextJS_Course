"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  PencilIcon,
  SunMoonIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetProjectById,
  useDeleteProject,
  useRenameProject,
} from "../hooks/project";
import { Spinner } from "@/components/ui/spinner";

const ProjectHeader = ({ projectId }) => {
  const router = useRouter();
  const { data: project, isPending } = useGetProjectById(projectId);
  const { setTheme, theme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [draftName, setDraftName] = useState("");

  const { mutateAsync: removeProject, isPending: isDeleting } =
    useDeleteProject();
  const { mutateAsync: saveName, isPending: isRenaming } = useRenameProject();

  const onRenameSelect = () => {
    setDraftName(project?.name ?? "");
    setIsRenameOpen(true);
  };

  const onRename = async () => {
    try {
      await saveName({ projectId, name: draftName });
      setIsRenameOpen(false);
      toast.success("Project renamed");
    } catch (error) {
      toast.error(error?.message ?? "Could not rename the project");
    }
  };

  const onDelete = async () => {
    try {
      await removeProject(projectId);
      toast.success("Project deleted");
      // Leave the page before the query refetches against a deleted row.
      router.push("/");
    } catch (error) {
      toast.error(error?.message ?? "Could not delete the project");
    }
  };

  return (
    <header className="flex items-center justify-between border-b p-2">
      {/* modal={false} matters: a modal DropdownMenu sets `pointer-events: none`
          on <body> while open, and that lock outlives the menu long enough to
          leave a Dialog opened from a menu item inert. */}
      {/* Base UI, not Radix: items fire onClick (there is no onSelect), and
          composition uses render={} rather than asChild. */}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="!pl-2 transition-opacity focus-visible:ring-0 hover:bg-transparent hover:opacity-75"
            >
              <Image
                src={"/logo.png"}
                alt="Gen-V"
                width={24}
                height={24}
                className="shrink-0 invert dark:invert-0"
              />
              <span className="max-w-56 truncate text-sm font-medium">
                {isPending ? <Spinner /> : project?.name || "Untitled Project"}
              </span>
              <ChevronDownIcon className="ml-1 size-4" />
            </Button>
          }
        />

        <DropdownMenuContent side="bottom" align="start" className="w-52">
          <DropdownMenuItem render={<Link href={"/"} />}>
            <ChevronLeftIcon className="size-4" />
            <span>Go to Dashboard</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onRenameSelect}>
            <PencilIcon className="size-4" />
            <span>Rename project</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="text-muted-foreground size-4" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={5}>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2Icon className="size-4" />
            <span>Delete project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              This only changes the name shown in your dashboard.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            maxLength={60}
            placeholder="Project name"
            onKeyDown={(e) => {
              if (e.key === "Enter" && draftName.trim()) onRename();
            }}
          />

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={onRename}
              disabled={isRenaming || !draftName.trim()}
            >
              {isRenaming && <Loader2Icon className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              “{project?.name}” and all of its messages and generated code will
              be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2Icon className="animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default ProjectHeader;

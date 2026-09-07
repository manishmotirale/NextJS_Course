"use client";

import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  FolderKanban,
  Calendar,
  Trash2Icon,
  MoreVerticalIcon,
  PencilIcon,
  CopyIcon,
  LinkIcon,
  StarIcon,
  ExternalLinkIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * The UI primitives here are Base UI (shadcn 4.x), not Radix. Two differences
 * that silently broke this menu:
 *
 *  - Menu items fire `onClick`. There is no `onSelect` prop, so every handler
 *    passed as onSelect was dropped and Rename/Delete did nothing at all.
 *  - Composition uses `render={<El />}`, not `asChild`. With asChild the
 *    trigger rendered its own button wrapping ours, producing nested buttons.
 */
const ProjectCard = ({
  project,
  view = "grid",
  onRequestRename,
  onRequestDelete,
  onToggleFavorite,
  onDuplicate,
}) => {
  const isList = view === "list";

  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/projects/${project.id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Project link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${project.name}`}
            className="text-muted-foreground hover:text-foreground size-8"
          >
            <MoreVerticalIcon className="size-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem render={<Link href={`/projects/${project.id}`} />}>
          <ExternalLinkIcon className="size-4" />
          Open project
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onRequestRename(project)}>
          <PencilIcon className="size-4" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onDuplicate(project)}>
          <CopyIcon className="size-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem onClick={copyLink}>
          <LinkIcon className="size-4" />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onToggleFavorite(project)}>
          <StarIcon
            className={cn("size-4", project.isFavorite && "fill-current")}
          />
          {project.isFavorite ? "Remove favorite" : "Add to favorites"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onRequestDelete(project)}
        >
          <Trash2Icon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const star = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={
        project.isFavorite
          ? `Remove ${project.name} from favorites`
          : `Add ${project.name} to favorites`
      }
      aria-pressed={project.isFavorite}
      onClick={() => onToggleFavorite(project)}
      className={cn(
        "size-8",
        project.isFavorite
          ? "text-amber-500 hover:text-amber-600"
          : "text-muted-foreground hover:text-amber-500 opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      <StarIcon className={cn("size-4", project.isFavorite && "fill-current")} />
    </Button>
  );

  const updated = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });

  if (isList) {
    return (
      <div className="group relative">
        <Link href={`/projects/${project.id}`} className="block">
          <Card
            className={cn(
              "hover:border-primary/60 flex flex-row items-center gap-3 gap-y-0 py-0 pr-24 pl-4 transition-colors hover:shadow-sm",
              project.isFavorite && "border-amber-500/40",
            )}
          >
            <div className="bg-primary/15 shrink-0 rounded-lg p-2">
              <FolderKanban className="text-primary size-4 dark:text-emerald-400" />
            </div>

            <div className="min-w-0 flex-1 py-3">
              <p className="group-hover:text-primary truncate text-sm font-medium transition-colors dark:group-hover:text-emerald-400">
                {project.name}
              </p>
              <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                <Calendar className="size-3" />
                {updated}
              </p>
            </div>
          </Card>
        </Link>

        {/* Controls sit outside the Link, so they cannot trigger navigation. */}
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
          {star}
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative h-full">
      <Link href={`/projects/${project.id}`} className="block h-full">
        <Card
          className={cn(
            "hover:border-primary/60 bg-card flex h-full flex-col gap-0 overflow-hidden py-0 transition-colors duration-200 hover:shadow-md",
            project.isFavorite && "border-amber-500/40",
          )}
        >
          <CardHeader className="gap-0 px-5 pt-5 pb-0">
            {/* No arrow affordance: the whole card is the link. pr-20 keeps the
                icon clear of the star + menu buttons in the corner. */}
            <div className="mb-3 pr-20">
              <div className="bg-primary/15 group-hover:bg-primary/25 w-fit rounded-lg p-2.5 transition-colors">
                <FolderKanban className="text-primary size-5 dark:text-emerald-400" />
              </div>
            </div>

            <CardTitle
              className="group-hover:text-primary line-clamp-1 text-base leading-snug transition-colors dark:group-hover:text-emerald-400"
              title={project.name}
            >
              {project.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-auto px-5 pt-3 pb-5">
            <div className="text-muted-foreground flex items-center text-xs">
              <Calendar className="mr-1.5 size-3.5 shrink-0" />
              <span className="truncate">{updated}</span>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div className="absolute top-3 right-3 flex items-center gap-0.5">
        {star}
        {actions}
      </div>
    </div>
  );
};

export default ProjectCard;

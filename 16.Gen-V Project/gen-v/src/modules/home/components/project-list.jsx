"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { FolderKanban, Loader2Icon, SearchXIcon, StarOffIcon } from "lucide-react";

import {
  useGetProjects,
  useDeleteProject,
  useRenameProject,
  useToggleFavorite,
  useDuplicateProject,
} from "@/modules/projects/hooks/project";
import { Skeleton } from "@/components/ui/skeleton";
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
import ProjectCard from "./project-card";
import ProjectToolbar from "./project-toolbar";

const sortProjects = (projects, sort) => {
  const copy = [...projects];

  switch (sort) {
    case "oldest":
      return copy.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    case "updated":
      return copy.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
    case "name":
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
    case "newest":
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
  }
};

const ProjectList = () => {
  const { data: projects, isPending } = useGetProjects();

  const { mutateAsync: removeProject, isPending: isDeleting } =
    useDeleteProject();
  const { mutateAsync: saveName, isPending: isRenaming } = useRenameProject();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutateAsync: duplicate } = useDuplicateProject();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [pendingDelete, setPendingDelete] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [draftName, setDraftName] = useState("");

  const favoriteCount = useMemo(
    () => (projects ?? []).filter((p) => p.isFavorite).length,
    [projects],
  );

  const visible = useMemo(() => {
    let list = projects ?? [];

    if (favoritesOnly) list = list.filter((p) => p.isFavorite);

    const term = search.trim().toLowerCase();
    if (term) list = list.filter((p) => p.name.toLowerCase().includes(term));

    return sortProjects(list, sort);
  }, [projects, favoritesOnly, search, sort]);

  const onConfirmDelete = async () => {
    try {
      await removeProject(pendingDelete.id);
      toast.success(`Deleted “${pendingDelete.name}”`);
      setPendingDelete(null);
    } catch (error) {
      toast.error(error?.message ?? "Could not delete the project");
    }
  };

  const onConfirmRename = async () => {
    try {
      await saveName({ projectId: renameTarget.id, name: draftName });
      toast.success("Project renamed");
      setRenameTarget(null);
    } catch (error) {
      toast.error(error?.message ?? "Could not rename the project");
    }
  };

  const onDuplicate = async (project) => {
    try {
      const copy = await duplicate(project.id);
      toast.success(`Created “${copy.name}”`);
    } catch (error) {
      toast.error(error?.message ?? "Could not duplicate the project");
    }
  };

  if (isPending) {
    return (
      <div className="mt-16 w-full">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
          Your Projects
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="mt-16 w-full">
        <div className="border-border/60 mx-auto flex max-w-md flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center">
          <FolderKanban className="text-muted-foreground size-6" />
          <p className="font-medium">No projects yet</p>
          <p className="text-muted-foreground text-sm">
            Describe an app above and your first project will show up here.
          </p>
        </div>
      </div>
    );
  }

  const isFiltered = Boolean(search.trim()) || favoritesOnly;

  return (
    <div className="mt-16 w-full">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Your Projects</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {/* Count reflects the active search and filter, not the total. */}
            {isFiltered
              ? `${visible.length} of ${projects.length} ${
                  projects.length === 1 ? "project" : "projects"
                }`
              : `${projects.length} ${
                  projects.length === 1 ? "project" : "projects"
                }`}
          </p>
        </div>

        <ProjectToolbar
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          favoritesOnly={favoritesOnly}
          onFavoritesOnlyChange={setFavoritesOnly}
          favoriteCount={favoriteCount}
        />

        {visible.length === 0 ? (
          <div className="border-border/60 flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
            {favoritesOnly && !search.trim() ? (
              <>
                <StarOffIcon className="text-muted-foreground size-6" />
                <p className="font-medium">No favorites yet</p>
                <p className="text-muted-foreground text-sm">
                  Star a project to keep it here.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setFavoritesOnly(false)}
                >
                  Show all projects
                </Button>
              </>
            ) : (
              <>
                <SearchXIcon className="text-muted-foreground size-6" />
                <p className="font-medium">No projects match “{search}”</p>
                <p className="text-muted-foreground text-sm">
                  Try a different name or clear the filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSearch("");
                    setFavoritesOnly(false);
                  }}
                >
                  Clear filters
                </Button>
              </>
            )}
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-2"
            }
          >
            {visible.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                view={view}
                onRequestDelete={setPendingDelete}
                onRequestRename={(p) => {
                  setDraftName(p.name);
                  setRenameTarget(p);
                }}
                onToggleFavorite={(p) => toggleFavorite(p.id)}
                onDuplicate={onDuplicate}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(renameTarget)}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      >
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
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && draftName.trim()) onConfirmRename();
            }}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={onConfirmRename}
              disabled={isRenaming || !draftName.trim()}
            >
              {isRenaming && <Loader2Icon className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              “{pendingDelete?.name}” and all of its messages and generated code
              will be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPendingDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2Icon className="animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectList;

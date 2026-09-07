"use client";

import { SearchIcon, XIcon, LayoutGridIcon, ListIcon, StarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "updated", label: "Recently updated" },
  { value: "name", label: "Name A–Z" },
];

const ProjectToolbar = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  favoriteCount,
}) => {
  const activeSort =
    SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];

  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects"
          aria-label="Search projects"
          className="h-9 pr-8 pl-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={favoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          className="h-9"
          aria-pressed={favoritesOnly}
        >
          <StarIcon
            className={cn("size-4", favoritesOnly && "fill-current")}
          />
          <span className="hidden sm:inline">Favorites</span>
          {favoriteCount > 0 && (
            <span className="text-xs opacity-70">{favoriteCount}</span>
          )}
        </Button>

        <DropdownMenu>
          {/* Base UI composes with `render`, not `asChild`. */}
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-9">
                <span className="text-muted-foreground hidden sm:inline">
                  Sort:
                </span>
                {activeSort.label}
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={sort} onValueChange={onSortChange}>
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Grid / list toggle */}
        <div className="bg-muted/60 flex h-9 items-center gap-0.5 rounded-md p-0.5">
          {[
            { value: "grid", Icon: LayoutGridIcon, label: "Grid view" },
            { value: "list", Icon: ListIcon, label: "List view" },
          ].map(({ value, Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onViewChange(value)}
              aria-label={label}
              aria-pressed={view === value}
              className={cn(
                "flex size-8 items-center justify-center rounded-[5px] transition-colors",
                view === value
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectToolbar;

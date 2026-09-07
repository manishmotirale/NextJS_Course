import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  ChevronRightIcon,
  FileCodeIcon,
  FileJsonIcon,
  FileTextIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  PaletteIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ICONS = {
  jsx: FileCodeIcon,
  tsx: FileCodeIcon,
  js: FileCodeIcon,
  ts: FileCodeIcon,
  mjs: FileCodeIcon,
  json: FileJsonIcon,
  css: PaletteIcon,
  md: FileTextIcon,
};

const FileTypeIcon = ({ name, className }) => {
  const extension = name.split(".").pop()?.toLowerCase();
  const Icon = ICONS[extension] ?? FileIcon;

  return <Icon className={className} />;
};

/**
 * Folders before files, each alphabetically. Tree items are either a string
 * (file) or an array of [name, ...children] (folder).
 */
const sortNodes = (nodes) => {
  return [...nodes].sort((a, b) => {
    const aIsFolder = Array.isArray(a);
    const bIsFolder = Array.isArray(b);

    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;

    const aName = aIsFolder ? a[0] : a;
    const bName = bIsFolder ? b[0] : b;

    return String(aName).localeCompare(String(bName));
  });
};

export const TreeView = ({ data, value, onSelect, highlightedPaths }) => {
  return (
    <SidebarProvider className="min-h-0 h-full">
      <Sidebar collapsible="none" className="w-full bg-transparent">
        <SidebarContent>
          <SidebarGroup className="p-1">
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {sortNodes(data).map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=""
                    highlightedPaths={highlightedPaths}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

const Tree = ({
  item,
  selectedValue,
  onSelect,
  parentPath,
  highlightedPaths,
}) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  // Folders start expanded so the generated files are visible immediately.
  const [isOpen, setIsOpen] = useState(true);

  // A leaf node: no children.
  if (!items.length) {
    const isSelected = selectedValue === currentPath;
    const isGenerated = highlightedPaths?.has(currentPath);

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isSelected}
          onClick={() => onSelect?.(currentPath)}
          className={cn(
            "h-7 text-[13px] font-normal",
            isSelected &&
              "bg-primary/30 text-foreground font-medium hover:bg-primary/35 dark:bg-primary/25",
          )}
        >
          <FileTypeIcon
            name={name}
            className={cn(
              "size-3.5 shrink-0",
              isGenerated ? "text-emerald-500" : "text-muted-foreground",
            )}
          />
          <span className="truncate">{name}</span>
          {isGenerated && (
            <span
              className="ml-auto size-1.5 shrink-0 rounded-full bg-emerald-500"
              title="Created or updated by this generation"
            />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      {/* Open state is controlled here rather than read from data attributes.
          These are Base UI primitives, which emit data-open / data-closed, not
          Radix's data-state="open", so selectors like
          group-data-[state=open]:rotate-90 never matched and the chevron and
          folder icons never reflected the real state. */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton className="h-7 text-[13px] font-medium">
              <ChevronRightIcon
                className={cn(
                  "text-muted-foreground size-3.5 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
              />
              {isOpen ? (
                <FolderOpenIcon className="text-muted-foreground size-3.5 shrink-0" />
              ) : (
                <FolderIcon className="text-muted-foreground size-3.5 shrink-0" />
              )}
              <span className="truncate">{name}</span>
            </SidebarMenuButton>
          }
        />

        {/* Without CollapsibleContent the children sit outside the collapsible
            and the open/closed state does nothing. */}
        <CollapsibleContent>
          <SidebarMenuSub className="mx-3 gap-0.5 px-1.5">
            {sortNodes(items).map((child, index) => (
              <SidebarMenuSubItem key={index} className="list-none">
                <Tree
                  item={child}
                  selectedValue={selectedValue}
                  onSelect={onSelect}
                  parentPath={currentPath}
                  highlightedPaths={highlightedPaths}
                />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

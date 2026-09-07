import { CopyCheckIcon, CopyIcon, SearchIcon, XIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CodeView } from "./code-view";
import ExportMenu from "./export-menu";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { convertFilesToTreeItems, cn } from "@/lib/utils";
import { TreeView } from "./tree-view";
import { Hint } from "@/components/ui/hint";

const FileBreadcrumb = ({ filePath }) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 4;

  const renderBreadCrumItems = () => {
    if (pathSegments.length <= maxSegments) {
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">{segment}</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    }

    return (
      <>
        <BreadcrumbItem>
          <span className="text-muted-foreground">{pathSegments[0]}</span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">
            {pathSegments[pathSegments.length - 1]}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1 sm:gap-1.5">
        {renderBreadCrumItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

function getLanguageFromExtension(filename) {
  const extension = filename.split(".").pop()?.toLowerCase();

  const languageMap = {
    js: "javascript",
    jsx: "jsx",
    mjs: "javascript",
    ts: "typescript",
    tsx: "tsx",
    py: "python",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    sh: "bash",
  };

  return languageMap[extension] || "text";
}

const FileExplorer = ({ files, projectFiles, fragment }) => {
  const [copied, setCopied] = useState(false);
  const [pickedFile, setSelectedFiles] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  // Memoised so the `files ?? {}` fallback does not create a new object each
  // render and invalidate every downstream useMemo.
  const generatedFiles = useMemo(() => files ?? {}, [files]);

  const hasProjectSnapshot =
    projectFiles && Object.keys(projectFiles).length > 0;

  // "All files" shows the captured project; older fragments only have the
  // generated files, so the toggle is hidden for them.
  const activeFiles = useMemo(() => {
    if (showAll && hasProjectSnapshot) {
      return { ...projectFiles, ...generatedFiles };
    }
    return generatedFiles;
  }, [showAll, hasProjectSnapshot, projectFiles, generatedFiles]);

  const visibleFiles = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return activeFiles;

    return Object.fromEntries(
      Object.entries(activeFiles).filter(([path]) =>
        path.toLowerCase().includes(term),
      ),
    );
  }, [activeFiles, search]);

  // Switching fragments swaps the `files` prop without remounting, so the
  // selection has to be derived rather than stored, otherwise a path from the
  // previous fragment leaves the pane empty.
  const selectedFile = useMemo(() => {
    if (pickedFile && activeFiles[pickedFile] !== undefined) return pickedFile;

    return (
      Object.keys(generatedFiles)[0] ?? Object.keys(activeFiles)[0] ?? null
    );
  }, [pickedFile, activeFiles, generatedFiles]);

  const treeData = useMemo(
    () => convertFilesToTreeItems(visibleFiles),
    [visibleFiles],
  );

  const generatedPaths = useMemo(
    () => new Set(Object.keys(generatedFiles)),
    [generatedFiles],
  );

  const handleFileSelect = useCallback(
    (filePath) => {
      if (activeFiles[filePath] !== undefined) setSelectedFiles(filePath);
    },
    [activeFiles],
  );

  const handleCopy = useCallback(() => {
    if (selectedFile && activeFiles[selectedFile]) {
      navigator.clipboard
        .writeText(activeFiles[selectedFile])
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((error) => {
          console.error("Failed to copy:", error);
        });
    }
  }, [selectedFile, activeFiles]);

  const fileCount = Object.keys(activeFiles).length;
  const matchCount = Object.keys(visibleFiles).length;

  return (
    // react-resizable-panels v4: the prop is `orientation`, not `direction`,
    // and NUMERIC sizes mean PIXELS. defaultSize={26} was literally 26px wide,
    // which is why the file tree was an unusable sliver. Percentages must be
    // passed as strings.
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      <ResizablePanel
        defaultSize="26%"
        minSize="15%"
        maxSize="50%"
        className="bg-sidebar/60 flex min-w-0 flex-col"
      >
        <div className="shrink-0 border-b p-2 space-y-2">
          {hasProjectSnapshot && (
            <div className="bg-muted/60 flex items-center gap-0.5 rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className={cn(
                  "flex-1 rounded-[5px] px-2 py-1 text-xs font-medium transition-colors",
                  !showAll
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Generated
                <span className="text-muted-foreground ml-1 font-normal">
                  {Object.keys(generatedFiles).length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className={cn(
                  "flex-1 rounded-[5px] px-2 py-1 text-xs font-medium transition-colors",
                  showAll
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All files
                <span className="text-muted-foreground ml-1 font-normal">
                  {Object.keys({ ...projectFiles, ...generatedFiles }).length}
                </span>
              </button>
            </div>
          )}

          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter files"
              className="h-8 pr-7 pl-7 text-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                aria-label="Clear filter"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {matchCount === 0 ? (
            <p className="text-muted-foreground p-4 text-center text-xs">
              No files match “{search}”
            </p>
          ) : (
            <TreeView
              data={treeData}
              value={selectedFile}
              onSelect={handleFileSelect}
              highlightedPaths={showAll ? generatedPaths : undefined}
            />
          )}
        </div>
      </ResizablePanel>

      <ResizableHandle className="bg-border hover:bg-primary/40 w-px transition-colors" />

      {/* min-w-0 + overflow-hidden are load-bearing: without them the code
          pane's long lines become the panel's intrinsic width, which pushes the
          file tree down to a few pixels wide no matter what minSize says. */}
      <ResizablePanel
        defaultSize="74%"
        minSize="40%"
        className="min-w-0 overflow-hidden"
      >
        {selectedFile && activeFiles[selectedFile] !== undefined ? (
          <div className="flex h-full w-full min-w-0 flex-col">
            <div className="bg-sidebar/40 flex items-center justify-between gap-x-2 border-b px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <FileBreadcrumb filePath={selectedFile} />
                {generatedPaths.has(selectedFile) && (
                  <Badge
                    variant="secondary"
                    className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
                  >
                    new
                  </Badge>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {fragment?.id && <ExportMenu fragment={fragment} />}
                <Hint text={copied ? "Copied" : "Copy file"} side="bottom" align="end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CopyCheckIcon className="size-4 text-emerald-500" />
                    ) : (
                      <CopyIcon className="size-4" />
                    )}
                  </Button>
                </Hint>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-auto">
              <CodeView
                code={activeFiles[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-1">
            <p className="text-sm">
              {fileCount === 0
                ? "No files in this version"
                : "Select a file to view its content"}
            </p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FileExplorer;

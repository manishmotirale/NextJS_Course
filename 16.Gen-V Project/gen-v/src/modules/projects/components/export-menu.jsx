"use client";

import { useState } from "react";
import {
  DownloadIcon,
  Loader2Icon,
  CheckIcon,
  ExternalLinkIcon,
} from "lucide-react";

/**
 * lucide-react v1 dropped brand icons, so `Github` no longer exists. Inline the
 * official mark rather than substituting a generic git icon.
 */
const GithubIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    className={className ?? "size-4"}
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.92-.88-2.92-2.75 0-.83.3-1.51.79-2.04-.08-.2-.35-1 .08-2.07 0 0 .64-.2 2.1.79a7.1 7.1 0 0 1 1.91-.26c.65 0 1.3.09 1.91.26 1.46-.99 2.1-.79 2.1-.79.43 1.07.16 1.87.08 2.07.49.53.79 1.21.79 2.04 0 1.88-1.15 2.55-2.93 2.75.3.26.56.76.56 1.54 0 1.11-.01 2.01-.01 2.29 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  downloadFragment,
  exportFragmentToGithub,
} from "../actions/export";

const ExportMenu = ({ fragment }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [token, setToken] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [result, setResult] = useState(null);

  const onDownload = async () => {
    setIsDownloading(true);

    try {
      const { base64, filename, fileCount } = await downloadFragment(fragment.id);

      // Server actions can't stream binary, so the zip arrives base64 encoded
      // and is turned back into a Blob here.
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/zip" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${fileCount} files`);
    } catch (error) {
      toast.error(error?.message ?? "Could not build the download");
    } finally {
      setIsDownloading(false);
    }
  };

  const onExport = async () => {
    setIsExporting(true);

    try {
      const res = await exportFragmentToGithub({
        fragmentId: fragment.id,
        token,
        repoName,
        isPrivate,
      });

      setResult(res);
      setToken("");
      toast.success(`Pushed ${res.fileCount} files to ${res.repo}`);
    } catch (error) {
      toast.error(error?.message ?? "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const openDialog = () => {
    setResult(null);
    setRepoName(
      fragment.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "gen-v-app",
    );
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          onClick={onDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <DownloadIcon />
          )}
          <span className="hidden sm:inline">Download</span>
        </Button>

        <Button size="sm" variant="outline" onClick={openDialog}>
          <GithubIcon />
          <span className="hidden sm:inline">GitHub</span>
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GithubIcon className="size-4" />
              Push to GitHub
            </DialogTitle>
            <DialogDescription>
              Creates a repository on your account and pushes this version as a
              single commit.
            </DialogDescription>
          </DialogHeader>

          {result ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Pushed {result.fileCount} files</p>
                  <p className="text-muted-foreground">{result.repo}</p>
                </div>
              </div>
              <Button
                className="w-full"
                render={
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Open repository <ExternalLinkIcon />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repo-name">Repository name</Label>
                <Input
                  id="repo-name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="my-landing-page"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gh-token">Personal access token</Label>
                <Input
                  id="gh-token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_..."
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  Needs the <code className="text-[11px]">repo</code> scope. Used
                  for this request only and never stored.{" "}
                  <a
                    className="underline hover:text-foreground"
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Gen-V"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Create one
                  </a>
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="size-4 accent-emerald-500"
                />
                Create as a private repository
              </label>
            </div>
          )}

          {!result && (
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                onClick={onExport}
                disabled={isExporting || !token.trim() || !repoName.trim()}
              >
                {isExporting && <Loader2Icon className="animate-spin" />}
                {isExporting ? "Pushing..." : "Push to GitHub"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportMenu;

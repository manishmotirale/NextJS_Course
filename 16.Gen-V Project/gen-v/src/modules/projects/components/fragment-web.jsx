import React, { useState } from "react";
import { ExternalLink, RefreshCcw, TimerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Spinner } from "@/components/ui/spinner";
import { usePreviewStatus } from "../hooks/project";

const FragmentWeb = ({ data }) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const { data: status, isPending, refetch } = usePreviewStatus(data.sandboxUrl);

  const isExpired = status === "expired";

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
    refetch();
  };

  const onCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text={"Refresh"} side={"bottom"} align={"start"}>
          <Button size={"sm"} variant={"outline"} onClick={onRefresh}>
            <RefreshCcw />
          </Button>
        </Hint>
        <Hint
          text={copied ? "Copied" : "Click to Copy"}
          side="bottom"
          align="start"
        >
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={onCopy}
            disabled={!data.sandboxUrl || copied}
            className={"flex-1 justify-start text-start font-normal"}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint text={"Open in New Tab"} side="bottom" align="start">
          <Button
            size={"sm"}
            variant={"outline"}
            disabled={!data.sandboxUrl || isExpired}
            onClick={() => {
              if (!data.sandboxUrl) return;

              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLink />
          </Button>
        </Hint>
      </div>

      {isPending ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="text-emerald-400" />
        </div>
      ) : isExpired ? (
        // Sandboxes expire after 15 minutes while the fragment URL is stored
        // permanently. Explain that instead of letting the iframe render E2B's
        // raw "sandbox was not found" error.
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <TimerOff className="size-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-medium">This preview has expired</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Sandboxes shut down a short while after they are created, so the
              live preview for this version is no longer running. The generated
              code is still saved: open the Code tab to browse it, or send
              another message to build a fresh preview.
            </p>
          </div>
        </div>
      ) : (
        <iframe
          key={fragmentKey}
          className="h-full w-full"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
          src={data.sandboxUrl}
        />
      )}
    </div>
  );
};

export default FragmentWeb;

// modules/chat/components/chat-view/model-selector.tsx
"use client";
import { useState } from "react";
import { Check, ChevronDown, Info, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function ModelSelector({
  models = [],
  selectedModelId,
  onModelSelect,
  className,
}: any) {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedModel = models.find((m: any) => m.id === selectedModelId);

  const formatContextLength = (length: number) => {
    if (!length) return "N/A";
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length.toString();
  };

  const isFreeModel = (model: any) => {
    return (
      model?.pricing?.prompt === "0" &&
      model?.pricing?.completion === "0" &&
      model?.pricing?.request === "0"
    );
  };

  const openModelDetails = (model: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForDetails(model);
    setDetailsOpen(true);
  };

  const filteredModels = models.filter((model: any) => {
    const query = searchQuery.toLowerCase();
    return (
      model.name?.toLowerCase().includes(query) ||
      model.description?.toLowerCase().includes(query) ||
      model.id?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
  
        <PopoverTrigger
          className={cn(
            "group/button inline-flex h-7 shrink-0 items-center justify-between gap-1.5 rounded-lg border border-border/40 bg-background/50 px-2.5 text-xs font-medium transition-colors hover:bg-accent/80 focus:outline-none",
            className,
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles className="h-3 w-3 shrink-0 text-primary" />
            <span className="truncate max-w-[130px]">
              {selectedModel?.name || "Select Model"}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0 border-border/80" align="start">
          <div className="p-2 border-b border-border/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-1 space-y-0.5">
              {filteredModels.length === 0 ? (
                <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No matching models found
                </div>
              ) : (
                filteredModels.map((model: any) => (
                  <div
                    key={model.id}
                    className={cn(
                      "relative flex cursor-pointer select-none items-start gap-2 rounded-lg px-2 py-2 text-xs transition-colors hover:bg-accent/80",
                      selectedModelId === model.id && "bg-accent",
                    )}
                    onClick={() => {
                      onModelSelect(model.id);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 mt-0.5 shrink-0 text-primary",
                        selectedModelId === model.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold truncate">
                          {model.name}
                        </span>
                        {isFreeModel(model) && (
                          <Badge
                            variant="secondary"
                            className="h-3.5 px-1 text-[9px] font-bold"
                          >
                            FREE
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {model.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0 opacity-60 hover:opacity-100"
                      onClick={(e) => openModelDetails(model, e)}
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              {selectedForDetails?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Model Specifications & Capabilities
            </DialogDescription>
          </DialogHeader>
          {selectedForDetails && (
            <div className="space-y-4 text-xs pt-2">
              <p className="text-muted-foreground leading-relaxed">
                {selectedForDetails.description}
              </p>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                    Context Limit
                  </span>
                  <span className="font-semibold">
                    {formatContextLength(selectedForDetails.context_length)}{" "}
                    tokens
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                    Model ID
                  </span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] truncate block">
                    {selectedForDetails.id}
                  </code>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

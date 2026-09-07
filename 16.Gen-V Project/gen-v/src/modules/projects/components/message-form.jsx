"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import z from "zod";
import { Spinner } from "@/components/ui/spinner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useCreateMessages } from "@/modules/messages/hooks/message";
import { useStatus } from "@/modules/usage/hooks/usage";
import { Usage } from "@/modules/usage/components/usage";

// import { onInvoke } from "../actions";

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Message description is required")
    .max(1000, "Description is too long"),
});

const MessageForm = ({ projectId }) => {
  const [isFocused, setIsFocused] = useState(false);

  const { mutateAsync, isPending } = useCreateMessages(projectId);
  const { data: usage } = useStatus();
  const showUsage = !!usage;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const content = useWatch({ control: form.control, name: "content" });

  const onSubmit = async (values) => {
    try {
      await mutateAsync(values.content);

      form.reset();
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    }
  };

  return (
    <Form {...form}>
      {showUsage && <Usage />}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "bg-sidebar relative rounded-xl border p-3 transition-all",
          // The usage panel above is rounded-t-xl with no bottom border, so the
          // form has to drop its top corners to join up instead of showing a
          // seam between two separately rounded boxes.
          showUsage && "rounded-t-none",
          isFocused && "ring-primary/25 border-primary/40 ring-2",
        )}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <TextAreaAutosize
              {...field}
              disabled={isPending}
              placeholder="Describe what you want to create..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={3}
              maxRows={8}
              className={cn(
                "placeholder:text-muted-foreground w-full resize-none border-none bg-transparent pt-1 text-sm outline-none",
                isPending && "opacity-50",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />

        <div className="flex items-end justify-between gap-x-2 pt-2">
          <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 font-mono">
              <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                <span>&#8984;</span>Enter
              </kbd>
              to submit
            </span>
            {/* Warn before the 1000 character schema limit rejects the submit. */}
            {content?.length > 800 && (
              <span
                className={cn(
                  "tabular-nums",
                  content.length > 1000 && "text-destructive",
                )}
              >
                {content.length}/1000
              </span>
            )}
          </div>

          <Button
            className="size-8 shrink-0 rounded-full"
            disabled={isPending || !content?.trim()}
            type="submit"
          >
            {isPending ? <Spinner /> : <ArrowUpIcon className="size-4" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;

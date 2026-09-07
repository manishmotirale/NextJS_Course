"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaAutosize from "react-textarea-autosize";
import { ArrowUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useCreateProject } from "@/modules/projects/hooks/project";

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Project description is required")
    .max(1000, "Description is too long"),
});

const PROJECT_TEMPLATES = [
  {
    emoji: "💬",
    title: "Build a Discord clone",
    prompt:
      "Build a Discord-style chat application with a server sidebar, channel list, chat window, and message input using mock data and local state. Use dark mode with clean spacing and modern UI.",
  },
  {
    emoji: "📈",
    title: "Build a finance dashboard",
    prompt:
      "Create a finance dashboard with balance cards, recent transactions, expense charts, and budget tracking using mock data and local state. Focus on a clean, professional layout.",
  },
  {
    emoji: "📝",
    title: "Build a notes app",
    prompt:
      "Build a modern notes application with folders, search, pinning, and CRUD functionality using local state. Prioritize minimal design, readability, and responsive layouts.",
  },
  {
    emoji: "📅",
    title: "Build a calendar app",
    prompt:
      "Create a calendar application with month and week views, event creation, and reminders using local state. Use a clean interface with intuitive navigation.",
  },
  {
    emoji: "🍔",
    title: "Build a food delivery app",
    prompt:
      "Build a food delivery interface with restaurant cards, category filters, a shopping cart, and checkout flow using mock data and local state. Focus on modern card design and smooth UX.",
  },
  {
    emoji: "🎓",
    title: "Build an LMS dashboard",
    prompt:
      "Create a learning management system dashboard with enrolled courses, progress tracking, assignments, and upcoming deadlines using local state. Use a clean educational interface.",
  },
  {
    emoji: "🏥",
    title: "Build a healthcare portal",
    prompt:
      "Build a healthcare dashboard with appointment scheduling, patient records, prescriptions, and doctor profiles using mock data and local state. Prioritize accessibility and clarity.",
  },
  {
    emoji: "✈️",
    title: "Build a travel booking app",
    prompt:
      "Create a travel booking platform with destination cards, search filters, booking forms, and itinerary previews using local state. Use attractive visuals and responsive layouts.",
  },
  {
    emoji: "📚",
    title: "Build a library management system",
    prompt:
      "Build a digital library with book search, categories, borrowing history, and book details using mock data and local state. Focus on organization and ease of navigation.",
  },
  {
    emoji: "🏋️",
    title: "Build a fitness tracker",
    prompt:
      "Create a fitness tracking dashboard with workout plans, progress charts, daily goals, and activity history using local state. Use vibrant visuals and clear data presentation.",
  },
];

const ProjectForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProject();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const handleTemplate = (prompt) => {
    form.setValue("content", prompt, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    try {
      const res = await mutateAsync(values.content);
      form.reset();
      toast.success("Project created successfully");
      router.push(`/projects/${res.id}`);
    } catch (error) {
      toast.error(error.message || "Failed to create project");
    }
  };

  const contentValue = useWatch({
    control: form.control,
    name: "content",
  });

  const isSubmitDisabled = !contentValue?.trim();

  const isButtonDisabled = isPending || !contentValue?.trim();

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* Header action bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Create a Project
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a template or type your own instructions.
          </p>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PROJECT_TEMPLATES.map((template, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleTemplate(template.prompt)}
            className="group relative p-3.5 rounded-xl border bg-card/60 hover:bg-accent/50 hover:border-primary/40 transition-all duration-200 text-left hover:shadow-sm flex flex-col justify-between"
          >
            <div className="flex flex-col gap-2">
              <span className="text-2xl" role="img" aria-label={template.title}>
                {template.emoji}
              </span>
              <h3 className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {template.title}
              </h3>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground font-medium tracking-wider">
            Or describe your own idea
          </span>
        </div>
      </div>

      {/* Input Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border rounded-2xl bg-card p-4 transition-all duration-200",
            isFocused
              ? "border-primary/50 shadow-md ring-4 ring-primary/10"
              : "border-border hover:border-border/80",
          )}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <TextAreaAutosize
                {...field}
                placeholder="Describe what you want to create in detail..."
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={3}
                maxRows={8}
                className="w-full resize-none border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    if (!isSubmitDisabled) {
                      form.handleSubmit(onSubmit)(e);
                    }
                  }
                }}
              />
            )}
          />

          <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-2">
            <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 font-mono">
                <kbd className="bg-muted text-muted-foreground inline-flex h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                  <span>⌘</span>Enter
                </kbd>
                to submit
              </span>
              {/* Warn before the 1000 character schema limit rejects the submit. */}
              {contentValue?.length > 800 && (
                <span
                  className={cn(
                    "tabular-nums",
                    contentValue.length > 1000 && "text-destructive",
                  )}
                >
                  {contentValue.length}/1000
                </span>
              )}
            </div>
            <Button
              type="submit"
              // Must also be disabled while the mutation is running,
              // otherwise a double click creates two projects.
              disabled={isButtonDisabled}
              size="icon"
              className={cn(
                "size-8 rounded-full transition-all duration-200",
                isButtonDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
              )}
            >
              {isPending ? (
                <Spinner className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;

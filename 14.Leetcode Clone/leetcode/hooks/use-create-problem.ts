"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { defaultFormValuses, problemSchema } from "@/modules/problems/schema";
import { SAMPLE_PROBLEMS } from "@/modules/problems/constant/sample-problem";
import { z } from "zod";

type ProblemFormData = z.infer<typeof problemSchema>;

interface UseCreateProblemOptions {
  problemId?: string;
  initialData?: Partial<ProblemFormData>;
}

export function useCreateProblem(options: UseCreateProblemOptions = {}) {
  const { problemId, initialData } = options;
  const isEditMode = Boolean(problemId);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [skipValidation, setSkipValidation] = useState(false);
  const [sampleType, setSampleType] =
    useState<keyof typeof SAMPLE_PROBLEMS>("DP");

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: (initialData ?? defaultFormValuses) as any,
  });

  const testCasesArray = useFieldArray({
    control: form.control,
    name: "testCases",
  });

  const tagsArray = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (values: ProblemFormData) => {
    try {
      setIsLoading(true);

      // Transform tags from [{value: string}] -> string[] before sending to API
      const payload = {
        ...values,
        tags: values.tags.map((t: any) =>
          typeof t === "string" ? t : t.value,
        ),
        skipValidation, // pass the toggle state to the API
        ...(isEditMode ? { problemId } : {}), // include id => update instead of create
      };

      const response = await fetch("/api/create-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // If server returned an HTML page instead of JSON, surface a readable message
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok && contentType.includes("text/html")) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Problem Created Response:", data);

      if (data.success) {
        toast.success(
          isEditMode
            ? "Problem updated successfully! 🎉"
            : "Problem created successfully! 🎉",
        );
        router.push("/problems");
        router.refresh();
      } else {
        // Show the specific validation failure message, including the underlying
        // compile/runtime detail so the real cause is visible.
        const message = data.detail
          ? `${data.error}\n${data.detail}`
          : data.error || "Failed to create problem";
        toast.error(message, {
          duration: 10000,
        });

        // If validation service is unreachable, prompt skip
        if (
          data.error?.includes("validation service") ||
          data.error?.includes("unreachable")
        ) {
          toast.info(
            "Tip: Toggle \"Skip Validation\" in the form header to bypass this check.",
            { duration: 8000 },
          );
        }
      }
    } catch (error: any) {
      console.error("Error creating problem:", error);
      toast.error(error?.message || "Network error — please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData =
      SAMPLE_PROBLEMS[sampleType as keyof typeof SAMPLE_PROBLEMS];

    if (sampleData.tags) {
      const wrappedTags = (sampleData.tags as any[]).map((t) =>
        typeof t === "string" ? { value: t } : t,
      );
      tagsArray.replace(wrappedTags);
    }

    if (sampleData.testCases) {
      testCasesArray.replace(sampleData.testCases as any[]);
    }

    // @ts-ignore
    form.reset({
      ...sampleData,
      tags: (sampleData.tags as any[]).map((t) =>
        typeof t === "string" ? { value: t } : t,
      ),
      skipValidation,
    });
  };

  return {
    form,
    isLoading,
    isEditMode,
    sampleType,
    setSampleType,
    skipValidation,
    toggleSkipValidation: () => setSkipValidation((v) => !v),
    onSubmit: form.handleSubmit(onSubmit),
    loadSampleData,
    testCasesArray,
    tagsArray,
  };
}

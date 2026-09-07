"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { Plus } from "lucide-react";

import { addTodo } from "@/actions/todo-actions";

const TodoForm = () => {
  const [title, setTitle] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });

      toast.success("Task Added Successfully");
    },

    onError: () => {
      toast.error("Failed to Add Task");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error("Title is Required");
      return;
    }

    mutation.mutate({
      title: trimmedTitle,
    });

    setTitle("");
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          value={title}
          placeholder="Add a new task..."
          onChange={(e) => setTitle(e.target.value)}
          className="
            h-11 flex-1 rounded-xl border-slate-300
            bg-white/80 text-sm shadow-sm
            focus-visible:ring-2
            focus-visible:ring-blue-500
            dark:border-zinc-700
            dark:bg-zinc-950/50
          "
          disabled={mutation.isPending}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="
            h-11 rounded-xl px-5
            bg-blue-600 text-white
            hover:bg-blue-700
            transition-all duration-200
            disabled:opacity-50
          "
        >
          <Plus size={18} className="mr-2" />

          {mutation.isPending ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </div>
  );
};

export default TodoForm;

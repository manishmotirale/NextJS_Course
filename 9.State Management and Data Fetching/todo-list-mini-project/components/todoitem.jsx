"use client";

import React from "react";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { toggleTodo, deleteTodo } from "@/actions/todo-actions";

const TodoItem = ({ todo }) => {
  const queryClient = useQueryClient();

  // Toggle Todo
  const { mutate: toggle } = useMutation({
    mutationFn: ({ id, completed }) => toggleTodo({ id, completed }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });

      toast.success("Task Updated");
    },

    onError: () => {
      toast.error("Failed to Update Task");
    },
  });

  // Delete Todo
  const { mutate: removeTodo } = useMutation({
    mutationFn: deleteTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });

      toast.success("Task Deleted!");
    },

    onError: () => {
      toast.error("Failed to Delete Task");
    },
  });

  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-xl border",
        "bg-white/70 p-4 shadow-sm backdrop-blur",
        "transition-all duration-200",
        "hover:shadow-md hover:border-slate-300",
        "dark:border-zinc-800 dark:bg-zinc-900/60",
        todo.completed && "opacity-70",
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={(checked) =>
            toggle({
              id: todo._id,
              completed: checked,
            })
          }
          id={`todo-${todo._id}`}
        />

        <label
          htmlFor={`todo-${todo._id}`}
          className={cn(
            "cursor-pointer text-sm font-medium transition-colors",
            "group-hover:text-blue-600 dark:group-hover:text-blue-400",
            todo.completed && "text-muted-foreground line-through",
          )}
        >
          {todo.title}
        </label>
      </div>

      {/* Delete button */}
      <Button
        variant="destructive"
        size="icon"
        onClick={() => removeTodo(todo._id)}
        className={cn(
          "text-red-500 transition-all",
          "hover:bg-red-50 hover:text-red-600",
          "dark:hover:bg-red-950/30",
        )}
      >
        <Trash size={18} />
      </Button>
    </div>
  );
};

export default TodoItem;

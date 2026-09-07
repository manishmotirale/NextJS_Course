"use client";

import React from "react";
import TodoItem from "./todoitem";
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "@/actions/todo-actions";
import { Loader2 } from "lucide-react";

const TodoList = () => {
  const {
    data: todos,
    isPending,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Loading state
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-900 dark:bg-red-950/30">
        Failed to Load Todos
      </div>
    );
  }

  // Empty state
  if (!todos || todos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        <p className="text-sm">No tasks yet</p>
        <p className="mt-1 text-xs">Add your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;

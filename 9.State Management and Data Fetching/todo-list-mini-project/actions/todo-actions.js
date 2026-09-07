"use server";

import { connectDB } from "@/lib/db";
import Todo from "@/models/todo";
import { todoSchema } from "@/schemas/todo-schema";

export async function addTodo(data) {
  try {
    await connectDB();

    const validatedFields = todoSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid fields",
        details: validatedFields.error.flatten(),
      };
    }

    const newTodo = await Todo.create(validatedFields.data);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newTodo)),
    };
  } catch (error) {
    console.error("Failed to create todo:", error);

    return {
      success: false,
      error: "Failed to create todo",
    };
  }
}

export async function getTodos() {
  try {
    await connectDB();

    const todos = await Todo.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    return JSON.parse(JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to get todos:", error);

    throw new Error("Failed to fetch todos");
  }
}

export async function toggleTodo({ id, completed }) {
  try {
    await connectDB();

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true },
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedTodo)),
    };
  } catch (error) {
    console.error("Failed to toggle todo:", error);

    return {
      success: false,
      error: "Failed to toggle todo",
    };
  }
}

export async function deleteTodo(id) {
  try {
    await connectDB();

    await Todo.findByIdAndDelete(id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete todo:", error);

    return {
      success: false,
      error: "Failed to delete todo",
    };
  }
}

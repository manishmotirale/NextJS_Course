"use server";

import { prisma } from "@/lib/db";

// Create Single User
export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!email || !name) return;

  const data = await prisma.user.create({
    data: {
      email,
      name,
      createdAt: new Date(),
    },
  });

  return data;
}

// Create Many Users
export async function createManyUsers() {
  const data = await prisma.user.createMany({
    data: [
      {
        name: "John",
        email: "john@example.com",
        createdAt: new Date(),
      },
      {
        name: "Alice",
        email: "alice@example.com",
        createdAt: new Date(),
      },
      {
        name: "Bob",
        email: "bob@example.com",
        createdAt: new Date(),
      },
    ],

    // skips duplicate emails if email is unique
    skipDuplicates: true,
  });

  return data;
}

// Get All Users
export async function getAllUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

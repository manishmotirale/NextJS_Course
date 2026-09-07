"use server";

import { db } from "@/lib/db/index";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface UserData {
  name: string;
  email: string;
  password: string;
}

export async function createUser(data: UserData) {
  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: data.password,
  });
}

export async function getUsers() {
  return await db.select().from(users);
}

export async function getUsersById(id: number) {
  return await db.select().from(users).where(eq(users.id, id));
}

export async function updateUsers(
  id: number,
  data: { name?: string; email?: string },
) {
  await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id));
}

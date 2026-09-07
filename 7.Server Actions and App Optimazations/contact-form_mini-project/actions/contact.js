// actions/contact.js

"use server";

import { dbConnet } from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContact(formData) {
  await dbConnet();

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  await Contact.create({
    name,
    email,
    message,
  });

  redirect("/dashboard");
}

export async function updateStatus(id) {
  await dbConnet();

  await Contact.findByIdAndUpdate(id, {
    status: "resolved",
  });

  revalidatePath("/dashboard");
}

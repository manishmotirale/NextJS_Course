"use server";
import { cacheLife, cacheTag } from "next/cache";

export async function getUsers() {
  "use cache";
  cacheLife("hours");
  cacheTag("users");

  const res = await fetch(
    "https://6a461816a268c8be2ce730b5.mockapi.io/api/users/users",
  );

  return res.json();
}

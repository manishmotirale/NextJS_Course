// Lecture 1
// "use server";
// import { profile } from "console";
// import { revalidateTag } from "next/cache";

// export async function getUsers() {
//   const response = await fetch(
//     "https://6a461816a268c8be2ce730b5.mockapi.io/api/users/users",
//     {
//       next: {
//         tags: ["users"],
//       },
//     }
//   );

//   const data = await response.json();
//   return data;
// }

// export async function updateList(){
//     revalidateTag("users", "max");
// }

// Lecture 2

"use server";

import { revalidateTag } from "next/cache";

export async function deleteUser(id: string) {
  await fetch(
    `https://6a461816a268c8be2ce730b5.mockapi.io/api/users/users/${id}`,
    {
      method: "DELETE",
    },
  );

  revalidateTag("users", "max");
}

export async function addUser(name: string, avatar: string) {
  await fetch("https://6a461816a268c8be2ce730b5.mockapi.io/api/users/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, avatar }),
  });

  revalidateTag("users", "max");
}

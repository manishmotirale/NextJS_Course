"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Jersey_15 } from "next/font/google";

async function addPost(newPost) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export default function AddPost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      alert("Post Added");

      console.log(post);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <button
      className="px-4 py-2 bg-amber-400 text-white rounded-md mt-10 cursor-pointer"
      onClick={() =>
        mutation.mutate({
          title: "New Post by Manish",
          body: "DEMO",
          userId: 1,
        })
      }
    >
      Add Post
    </button>
  );
}

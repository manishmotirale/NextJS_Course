"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchPost() {
  const res = await fetch("http://jsonplaceholder.typicode.com/posts");
  return res.json();
}

export default function PostLst() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPost,
  });

  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <p>{error} fetching Posts</p>;
  }
  return (
    <div>
      {data.map((post) => (
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  );
}

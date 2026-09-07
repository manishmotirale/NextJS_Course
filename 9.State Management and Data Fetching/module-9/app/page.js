"use client";
import AddPost from "@/components/add-post";
import PostList from "@/components/post-list";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  // const [data, setData] = useState(null);
  // const [isLoading, setisLoading] = useState(false);
  // const [error, seterror] = useState(null);

  // const fetchUserData = async () => {
  //   try {
  //     setisLoading(true);
  //     const res = await fetch(
  //       "https://api.freeapi.app/api/v1/public/randomusers?page=1&limit=10",
  //     );
  //     const data = await res.json();
  //     setData(data);
  //     setisLoading(false);
  //   } catch (error) {
  //     seterror(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  // const {data, error, isLoading} = useQuery({
  //   queryKey: ["user-data"],
  //   queryFn: () =>
  //     fetch(
  //       "https://api.freeapi.app/api/v1/public/randomusers?page=1&limit=10",
  //     ).then((res)=>res.json())
  // });

  // if (isLoading) {
  //   return <div>Loading....</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }
  return (
    <div>
      <h1>Posts</h1>
      <PostList />
      <AddPost />
    </div>
  );
}

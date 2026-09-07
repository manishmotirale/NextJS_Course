import React from "react";

const SearchPage = async ({ searchParams }) => {
  const { query } = await searchParams;

  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts/" + query,
  );
  const data = await res.json();
  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </div>
  );
};

export default SearchPage;

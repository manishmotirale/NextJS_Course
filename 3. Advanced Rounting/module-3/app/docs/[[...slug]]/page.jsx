import React from "react";

const Page = async ({ params }) => {
  const { slug } = await params;

  return (
    <div>
      Page {slug ? slug.join("/") : "Docs Home"}
    </div>
  );
};

export default Page;
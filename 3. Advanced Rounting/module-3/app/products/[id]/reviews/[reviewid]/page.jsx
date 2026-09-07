import React from "react";

const Page = async ({ params }) => {
  const { id, reviewid } = await params;

  return (
    <div>
      Page {id} - Review {reviewid}
    </div>
  );
};

export default Page;
import React from "react";

export async function generateMetadata({ params }) {
  const { userId } = await params;

  return {
    title: `User ${userId}`,
    description: `Profile page for user ${userId}`,
  };
}

const UserIdPage = async ({ params }) => {
  const { userId } = await params;
  return <div>UserIdPage {userId}</div>;
};

export default UserIdPage;

import React from "react";
import Link from "next/link";

const DashBoardPage = () => {
  return (
    <div>
      <h1>DashBoardPage</h1>
      <Link href={"/profile"}>View Profile</Link>
    </div>
  );
};

export default DashBoardPage;

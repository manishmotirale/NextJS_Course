"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";

const ShopTagItemPage = () => {
  const params = useParams();
  const pathname = usePathname();
  console.log(params);

  return <div>ShopTagItemPage : {pathname}</div>;
};

export default ShopTagItemPage;

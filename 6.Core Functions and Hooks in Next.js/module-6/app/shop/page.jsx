"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";

const ShopePage = () => {
  const params = useParams();
  const pathname = usePathname();
  console.log(params);

  return <div>ShopePage : {pathname}</div>;
};

export default ShopePage;

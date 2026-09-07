import { requireUnAuth } from "@/modules/auth/actions";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireUnAuth();
  return <div>{children}</div>;
};

export default AuthLayout;

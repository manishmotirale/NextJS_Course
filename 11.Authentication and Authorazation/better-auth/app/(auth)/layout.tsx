import { requireUnAuth } from "@/lib/auth-guard";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireUnAuth();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;

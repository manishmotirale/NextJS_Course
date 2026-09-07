"use client";
import React from "react";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutBtn = () => {
  const router = useRouter();
  const onlogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logout SuccessFully!!");
          router.push("/login");
        },
      },
    });
  };
  return (
    <Button variant={"destructive"} size={"lg"} onClick={onlogout}>
      Logout
    </Button>
  );
};

export default LogoutBtn;

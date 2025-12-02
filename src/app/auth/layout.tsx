"use client";

import { useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";    

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/home");
  } else {
    return <div>{children}</div>;
  }
}
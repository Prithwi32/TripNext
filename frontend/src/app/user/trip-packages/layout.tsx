"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user.role !== "user")) {
      router.push("/auth/login");
    }

    if(status === "authenticated" && session?.user.role === "guide") {
      router.push("/guide/dashboard");
    }
  }, [status, router]);

  return (
    <>
        {status === "loading" ? <Loading /> : children}
    </>
  );
}

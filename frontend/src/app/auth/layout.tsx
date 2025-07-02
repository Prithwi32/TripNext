"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Loading from "../loading";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const redirectPath =
        session.user.role === "guide" ? "/guide/dashboard" : "/user/dashboard";

      window.location.href = redirectPath;
    }
  }, [session, status]);

  return <> {status === "loading" ? <Loading /> : children}</>;
}

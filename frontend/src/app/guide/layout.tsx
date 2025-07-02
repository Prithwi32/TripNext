"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Loading from "../loading";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "user") {
        window.location.href = "/user/dashboard";
      }
    } else if (status === "unauthenticated") {
      window.location.href = "/auth/login";
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (status === "authenticated" && session?.user?.role === "guide") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading />
    </div>
  );
}

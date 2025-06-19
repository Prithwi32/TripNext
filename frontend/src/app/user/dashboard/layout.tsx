"use client";

import {
  UserSidebar,
  MobileUserSidebar,
} from "@/app/user/dashboard/components/user-sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";

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
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        <UserSidebar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <MobileUserSidebar />
      <Toaster />
    </>
  );
}

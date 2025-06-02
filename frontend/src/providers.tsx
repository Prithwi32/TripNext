"use client";

import { SessionProvider } from "next-auth/react";
import { InitialLoader } from "@/components/initial-loader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InitialLoader>{children}</InitialLoader>
    </SessionProvider>
  );
}

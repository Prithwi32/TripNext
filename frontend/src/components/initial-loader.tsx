"use client";

import { useState, useEffect } from "react";
import Loading from "@/app/loading";

interface InitialLoaderProps {
  children: React.ReactNode;
}

export function InitialLoader({ children }: InitialLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let hasVisited = false;

    try {
      hasVisited = sessionStorage.getItem("hasVisitedBefore") === "true";
    } catch (e) {
      console.log("SessionStorage not available");
    }

    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        try {
          sessionStorage.setItem("hasVisitedBefore", "true");
        } catch (e) {
          console.log("SessionStorage not available");
        }
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isMounted) return null;

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Loading() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center w-full h-full bg-background dark:bg-background z-50">
      {/* Map background with subtle animation */}
      <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjlGQUZCIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN0FDQyIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDY2TDAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN0FDQyIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDY2TDU2IDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDdBQ0MiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8cGF0aCBkPSJNMjggMzNMMCAyNUwwIDE2TDI4IDBMNTYgMTZMNTYgMjVMMjggMzMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQTUwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] animate-[pan_30s_linear_infinite]"></div>
      </div>

      {/* Main travel loader animation */}
      <div className="relative">
        {/* Orbit circle */}
        <div className="w-48 h-48 rounded-full border border-secondary/30 dark:border-secondary/20 relative">
          {" "}
          {/* Airplane animation */}
          <div className="absolute w-full h-full animate-[orbit_3s_linear_infinite]">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl transform rotate-45">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary dark:text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.56,3.91C21.15,4.5 21.15,5.45 20.56,6.03L16.67,9.92L18.79,19.11L17.38,20.53L13.5,13.1L9.6,17L9.96,19.47L8.89,20.53L7.13,17.35L3.94,15.58L5,14.5L7.5,14.87L11.37,11L3.94,7.09L5.36,5.68L14.55,7.8L18.44,3.91C19.03,3.33 19.97,3.33 20.56,3.91Z" />
              </svg>
            </div>
          </div>
          {/* Destination pin */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-secondary dark:text-secondary animate-bounce"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
              </svg>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-secondary/30 dark:bg-secondary/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          {/* Earth/globe in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/70 to-primary relative overflow-hidden">
              {/* Continents */}
              <div className="absolute top-2 left-2 w-4 h-3 bg-secondary/70 rounded-full transform rotate-12"></div>
              <div className="absolute top-6 right-3 w-5 h-5 bg-secondary/70 rounded-sm transform -rotate-12"></div>
              <div className="absolute bottom-3 left-4 w-6 h-2 bg-secondary/70 rounded-md"></div>

              {/* Moving clouds layer */}
              <div className="absolute inset-0 bg-white/20 dark:bg-white/10">
                <div className="absolute top-1 left-0 w-6 h-1.5 bg-white/40 dark:bg-white/30 rounded-full animate-[cloudsMove_7s_linear_infinite]"></div>
                <div className="absolute top-9 left-5 w-4 h-1 bg-white/40 dark:bg-white/30 rounded-full animate-[cloudsMove_7s_linear_infinite_1.5s]"></div>
              </div>
            </div>
          </div>
          {/* Pulsing ring */}
          <div className="absolute inset-[-8px] border border-primary/20 dark:border-primary/10 rounded-full animate-ping opacity-75 duration-1000"></div>
        </div>

        {/* Sun rays */}
        <div className="absolute inset-[-1.5rem] flex items-center justify-center">
          <div className="w-64 h-64 bg-gradient-to-r from-secondary/5 dark:from-secondary/2 to-transparent rounded-full animate-[spin_20s_linear_infinite]"></div>
        </div>
      </div>

      {/* Company name and loading text */}
      <div className="mt-16 text-center relative z-10">
        <div className="inline-flex items-center mb-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50 dark:to-primary/30"></div>
          <h1 className="mx-3 text-3xl font-bold text-primary dark:text-primary">
            Trip<span className={`text-black dark:text-white`}>Next</span>
          </h1>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-secondary/50 dark:to-secondary/30"></div>
        </div>

        <p className="text-foreground/70 dark:text-foreground/70 text-sm tracking-wider font-light">
          <span>PREPARING YOUR JOURNEY</span>
          <span className="inline-flex mx-1 items-end pb-0.5">
            <span className="w-1 h-1 bg-secondary rounded-full mx-0.5 animate-[bounce_1.5s_ease-in-out_infinite_0ms]"></span>
            <span className="w-1 h-1 bg-secondary rounded-full mx-0.5 animate-[bounce_1.5s_ease-in-out_infinite_200ms]"></span>
            <span className="w-1 h-1 bg-secondary rounded-full mx-0.5 animate-[bounce_1.5s_ease-in-out_infinite_400ms]"></span>
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-64 sm:w-80 md:w-96">
        <div className="mb-1 text-xs text-foreground/50 dark:text-foreground/50 flex justify-between">
          <span>Departure</span>
          <span>Arrival {Math.round(progress)}%</span>
        </div>
        <div className="h-1 w-full bg-muted dark:bg-muted rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

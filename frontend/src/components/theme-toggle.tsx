"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme toggle is rendered on the client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Avoid hydration mismatch by only rendering when component is mounted
  if (!mounted) {
    return null;
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full relative overflow-hidden transition-all duration-500 ease-in-out hover:bg-secondary hover:text-secondary-foreground"
    >
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out dark:opacity-0">
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 ease-in-out rotate-0 dark:-rotate-90" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-in-out dark:opacity-100">
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 ease-in-out rotate-90 dark:rotate-0" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

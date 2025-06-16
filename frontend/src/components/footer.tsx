"use client";

import { useTheme } from "next-themes";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const {theme} = useTheme();

  return (
    <footer className="bg-background border-t dark:border-gray-800 w-full py-4 mt-auto z-50">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground text-sm">
          © {currentYear} <span className="text-primary">Trip</span><span className={`text-${theme === "dark" ? "white" : "black"}`}>Next</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

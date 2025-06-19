"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, Map, Home, Settings } from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    href: "/user/dashboard/profile",
    icon: User,
  },
  {
    title: "My Trips",
    href: "/user/dashboard/trips",
    icon: Map,
  },
  {
    title: "My Blogs",
    href: "/user/dashboard/blogs",
    icon: FileText,
  }
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full flex-col bg-background border-r shadow-sm pb-2">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">User Dashboard</h2>
      </div>
      <div className="flex flex-col space-y-1 px-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-x-2 text-foreground/60 hover:text-black hover:bg-secondary/90 px-3 py-2 rounded-md transition-all",
              pathname === item.href && "text-black bg-secondary/90"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MobileUserSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-16 bg-background border-t shadow-sm">
      <div className="grid grid-cols-4 h-full">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-y-1 text-foreground/60 hover:text-foreground transition-colors",
              pathname === item.href && "text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { User, Package, Plus, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    title: "Profile",
    icon: User,
    id: "profile",
  },
  {
    title: "My Packages",
    icon: Package,
    id: "packages",
  },
  {
    title: "Add Package",
    icon: Plus,
    id: "add-package",
  },
];

export function AppSidebar({
  activeSection,
  setActiveSection,
}: AppSidebarProps) {
  return (
    <Sidebar className="bg-background text-foreground border-r border-muted mt-20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    className={`hover:bg-accent/50 hover:text-accent-foreground`}
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-4 text-xs text-foreground/70">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

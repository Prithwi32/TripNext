// "use client";

// import { User, Package, Plus } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// interface AppSidebarProps {
//   activeSection: string;
//   setActiveSection: (section: string) => void;
// }

// const menuItems = [
//   {
//     title: "Profile",
//     icon: User,
//     id: "profile",
//   },
//   {
//     title: "My Packages",
//     icon: Package,
//     id: "packages",
//   },
//   {
//     title: "Add Package",
//     icon: Plus,
//     id: "add-package",
//   },
// ];

// export function AppSidebar({
//   activeSection,
//   setActiveSection,
// }: AppSidebarProps) {
//   return (
//     <Sidebar className="bg-background text-foreground border-r border-muted mt-20">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Navigation</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.id}>
//                   <SidebarMenuButton
//                     className={`hover:bg-secondary hover:text-secondary-foreground`}
//                     onClick={() => setActiveSection(item.id)}
//                     isActive={activeSection === item.id}
//                   >
//                     <item.icon />
//                     <span>{item.title}</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }


"use client";

import { User, Package, Plus } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex bg-background text-foreground border-r border-muted mt-20">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      className="hover:bg-secondary hover:text-secondary-foreground"
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
      </Sidebar>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t shadow-sm h-16">
        <div className="grid grid-cols-3 h-full">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "flex flex-col items-center justify-center text-xs transition-colors",
                activeSection === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}


"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileSection } from "./components/ProfileSection";
import { PackagesSection } from "./components/PackagesSection";
import { AddPackageSection } from "./components/AddPackageForm";
import { Separator } from "@/components/ui/separator";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import GuideChatInterface from "./chats/page";

export default function GuideDashboard() {
  const [activeSection, setActiveSection] = useState("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "packages":
        return <PackagesSection />;
      case "add-package":
        return <AddPackageSection />;
      default:
        return <ProfileSection />;
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeSection) {
      case "profile":
        return "Profile";
      case "packages":
        return "My Packages";
      case "add-package":
        return "Add Package";
      default:
        return "Profile";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SidebarProvider>
        <AppSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 hidden md:inline-flex" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {renderContent()}
          </div>
          <GuideChatInterface />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

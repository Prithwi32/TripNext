"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);
  const [isHideNavbar, setIsHideNavbar] = useState(false);

  useEffect(() => {
    const checkIfNotFoundPage = () => {
      const notFoundPage = document.querySelector('[data-not-found-page]');
      setIsNotFoundPage(!!notFoundPage);
    };

    const checkIfHideNavbar = () => {
      setIsHideNavbar(pathname.includes("/auth"));
    }

    checkIfHideNavbar();
    checkIfNotFoundPage();
    
    const timer = setTimeout(checkIfNotFoundPage, 100);
    
    const observer = new MutationObserver(checkIfNotFoundPage);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname, children]);
  
  return (
    <>
      {!isNotFoundPage && !isHideNavbar && <Navbar />}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isNotFoundPage && <Footer />}
    </>
  );
}

"use client";

import {
  HomeIcon,
  Images,
  MenuIcon,
  NotebookPen,
  UserIcon,
  LogOut,
  TicketsPlane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";

function MobileNavbar() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const handleClick = () => {
    const hasVerifyEmail = localStorage.getItem("verifyEmail");
    if (hasVerifyEmail) {
      router.push("/auth/resend-verify");
    } else {
      signIn();
    }
  };

  return (
    <div className="flex md:hidden items-center space-x-2">
      <ThemeToggle />

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-secondary">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start hover:bg-secondary transition-colors duration-200"
              asChild
            >
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                Home
              </Link>
            </Button>
            {user ? (
              <>
                {user.role == "user" && (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start hover:bg-secondary transition-colors duration-200"
                    asChild
                  >
                    <Link href="/user/trip-recommend">
                      <NotebookPen className="w-4 h-4" />
                      Trip Plans
                    </Link>
                  </Button>
                )}
                {user.role == "user" && (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start hover:bg-secondary transition-colors duration-200"
                    asChild
                  >
                    <Link href="/user/trip-packages">
                      <TicketsPlane className="w-4 h-4" />
                      Trip Packages
                    </Link>
                  </Button>
                )}
                {user.role == "user" && (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start hover:bg-secondary transition-colors duration-200"
                    asChild
                  >
                    <Link href="/user/gallery">
                      <Images className="w-4 h-4" />
                      Gallery
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start hover:bg-secondary transition-colors duration-200"
                  asChild
                >
                  <Link href="/blogs">
                    <HomeIcon className="w-4 h-4" />
                    Blogs
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start hover:bg-secondary transition-colors duration-200"
                  asChild
                >
                  <Link href={`/${user.role}/dashboard`}>
                    <UserIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start w-full hover:bg-destructive/90 transition-colors duration-200"
                  onClick={async () => {
                    await signOut({ redirect: false });
                    router.push("/");
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={handleClick}
              >
                Sign In
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;

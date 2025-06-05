"use client";

import {
  HomeIcon,
  Images,
  MenuIcon,
  NotebookPen,
  UserIcon,
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

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex md:hidden items-center space-x-2">
      <ThemeToggle/>

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
                    <Link href="/trip-plans">
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
                    <Link href="/gallery">
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
                  <Link
                    href={`/${
                      user.role}/dashboard`}
                  >
                    <UserIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start w-full hover:bg-destructive/90 transition-colors duration-200"
                  onClick={() => signOut()}
                >
                  <UserIcon className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={() => signIn()}
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

"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, SunMoon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const verifyEmail = localStorage.getItem("verifyEmail");
    const currentPath = window.location.pathname;

    if (verifyEmail && currentPath !== "/auth/verify") {
      router.push("/auth/verify");
    }
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!session?.user);
  }, [session]);

  const handleButtonClick = async () => {
    if (isLoggedIn) {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      setIsLoggedIn(false);
      localStorage.removeItem("verifyEmail");
      localStorage.removeItem("role");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <section className="px-4 py-12 mb-10 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 lg:pl-6 text-center lg:text-left">
          <div>
            <div className="inline-block text-sm font-medium mb-4">
              New Release
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Welcome to Our Website
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.
          </p>
          <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
            <Button
              className="group px-24 sm:px-8"
              size="lg"
              onClick={handleButtonClick}
            >
              {isLoggedIn ? "Logout" : "Login"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="group px-24 sm:px-8"
              size="lg"
              variant={"secondary"}
            >
              <SunMoon className="mr-2 h-4 w-4" />
              <span className="transition-transform group-hover:translate-x-1">
                Theme
              </span>
            </Button>
          </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <div className="relative w-full aspect-[4/3]">
            <div className="absolute hover:scale-[1.03] cursor-pointer transition-all right-[50%] top-[-5%] flex aspect-square w-[24%] justify-center rounded-lg border border-border bg-accent"></div>
            <div className="absolute hover:scale-[1.03] cursor-pointer transition-all right-[50%] top-[30%] flex aspect-[5/6] w-[40%] justify-center rounded-lg border border-border bg-accent"></div>
            <div className="absolute hover:scale-[1.03] cursor-pointer transition-all bottom-[26%] left-[54%] flex aspect-[5/6] w-[40%] justify-center rounded-lg border border-border bg-accent"></div>
            <div className="absolute hover:scale-[1.03] cursor-pointer transition-all bottom-[-10%] left-[54%]  flex aspect-square w-[24%] justify-center rounded-lg border border-border bg-accent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

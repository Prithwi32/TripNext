import {
  HomeIcon,
  Images,
  LogOut,
  Logs,
  NotebookPen,
  TicketsPlane,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

function DesktopNavbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "";
    if (user.name) {
      return user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email ? user.email[0].toUpperCase() : "U";
  };

  // Get profile route
  const getProfileRoute = () => {
    if (!user) return "/auth/login";

    if (user.role === "guide") {
      return "/guide/dashboard";
    } else if (user.role === "user") {
      return "/user/dashboard";
    }
    return "auth/login";
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-secondary transition-colors duration-200"
        asChild
      >
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      {user ? (
        <>
          {user.role == "user" && (
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-secondary transition-colors duration-200"
              asChild
            >
              <Link href="/user/trip-recommend">
                <NotebookPen className="w-4 h-4" />
                <span className="hidden lg:inline">Trips Plans</span>
              </Link>
            </Button>
          )}
          {user.role == "user" && (
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-secondary transition-colors duration-200"
              asChild
            >
              <Link href="/user/trip-packages">
                <TicketsPlane className="w-4 h-4" />
                <span className="hidden lg:inline">Trips Packages</span>
              </Link>
            </Button>
          )}
          {user.role == "user" && (
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-secondary transition-colors duration-200"
              asChild
            >
              <Link href="/user/gallery">
                <Images className="w-4 h-4" />
                <span className="hidden lg:inline">Gallery</span>
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-secondary transition-colors duration-200"
            asChild
          >
            <Link href="/blogs">
              <Logs className="w-4 h-4" />
              <span className="hidden lg:inline">Blogs</span>
            </Link>
          </Button>
          <ThemeToggle />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                <AvatarImage
                  src={user.profileImage || ""}
                  alt={user.profileImage || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  {user.email && (
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={getProfileRoute()}
                  className="flex items-center gap-2 cursor-pointer hover:bg-secondary focus:bg-secondary w-full px-2 py-1.5 rounded-sm"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={async () => {
                  await signOut({ redirect: false });
                  router.push("/");
                }}
                className="group flex items-center gap-2 cursor-pointer text-destructive w-full px-2 py-1.5 rounded-sm data-[highlighted]:bg-destructive/90 focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <ThemeToggle />
          <Button variant="default" onClick={() => signIn()}>
            Sign In
          </Button>
        </>
      )}
    </div>
  );
}
export default DesktopNavbar;

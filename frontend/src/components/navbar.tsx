import Link from "next/link";
import DesktopNavbar from "./deskTopNavbar";
import MobileNavbar from "./mobileNavbar";
import { useTheme } from "next-themes";
import Image from "next/image";

function Navbar() {
  const { theme } = useTheme();
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="TripNext Logo"
                  width={34}
                  height={34}
                  className="h-10 w-10 object-contain"
                />
                <h1 className="text-xl font-bold text-primary travel-underline">
                  Trip
                  <span
                    className={`${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Next
                  </span>
                </h1>
              </div>
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;

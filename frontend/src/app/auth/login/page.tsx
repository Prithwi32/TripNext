import { Home, Plane } from "lucide-react";
import { LoginForm } from "./components/login-form";
import { AnimatedIllustration } from "@/components/animated-illustration";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/10 to-secondary/10 md:flex-row">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-4">
        <Link href="/" aria-label="Home">
          <div className="p-3 rounded-full hover:bg-primary transition-colors cursor-pointer">
            <Home className="h-4 w-4 text-foreground" />
          </div>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex w-full items-center justify-center p-6 md:w-1/2 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-primary">TripNext</h1>
            </div>
            <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-2">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <div className="hidden w-1/2 bg-gradient-to-br from-primary/30 to-secondary/30 md:block">
        <AnimatedIllustration
          images={[
            "/u.avif",
            "/travel1.avif",
            "/travel2.avif",
            "/travel3.avif",
            "/travel4.avif",
            "/travel5.avif",
            "/travel7.avif",
            "/travel6.avif",
          ]}
          title="Discover Amazing Destinations"
          description="Join our community of travelers and guides to explore the world's most beautiful places"
          animation="fade"
        />
      </div>
    </div>
  );
}

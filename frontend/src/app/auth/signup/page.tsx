import { SignupForm } from "./components/signup-form";
import { AnimatedIllustration } from "@/components/animated-illustration";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plane } from "lucide-react";

export default async function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/10 to-accent/10 md:flex-row">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left side - Image/Animation (reversed order on desktop) */}
      <div className="hidden w-1/2 bg-gradient-to-br from-accent/30 to-primary/30 md:block">
        <AnimatedIllustration
          images={["/u.avif", "/travel1.avif", "/travel2.avif", "/travel3.avif",  "/travel4.avif", "/travel5.avif",  "/travel7.avif", "/travel6.avif"]}
          title="Discover Amazing Destinations"
          description="Join our community of travelers and guides to explore the world's most beautiful places"
          animation="fade"
        />
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center p-6 md:w-1/2 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-primary">TravelNext</h1>
            </div>
            <h2 className="mt-6 text-3xl font-bold">Create an account</h2>
            <p className="mt-2 text-muted-foreground">
              Sign up to start your travel journey
            </p>
          </div>

          <SignupForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By signing up, you'll receive travel updates and recommendations
            from us. You can unsubscribe at any time.
          </div>
        </div>
      </div>
    </div>
  );
}

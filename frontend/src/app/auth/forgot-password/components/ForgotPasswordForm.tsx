"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "guide">("user");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = `/api/${role}/forget-password`;

      await axiosInstance.post(endpoint, {
        [`${role}Email`]: email,
      });

      toast.success("OTP sent to your email!");
      localStorage.setItem("resetEmail", email);
      localStorage.setItem("role", role);
      router.push("/auth/reset-password");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto border-border/40 shadow-lg">
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and role to receive a reset code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                />
                <span>User</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="guide"
                  checked={role === "guide"}
                  onChange={() => setRole("guide")}
                />
                <span>Guide</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
            {!isLoading && <Mail className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground text-center">
        Remember your password?{" "}
        <a href="/auth/login" className="underline ml-1">
          Login
        </a>
      </CardFooter>
    </Card>
  );
}

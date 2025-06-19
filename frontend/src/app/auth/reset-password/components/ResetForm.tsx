"use client";

import { useState} from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

export function ResetPasswordForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("resetEmail") || ""
      : "";
  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role") || "user"
      : "user";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      const endpoint = `/api/${role}/reset-password`;

      await axiosInstance.post(`/api/${role}/reset-password`, {
        [`${role}Email`]: email,
        otp,
        newPassword,
      });

      toast.success("Password reset successful!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("role");
      router.push("/auth/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto border-border/40 shadow-lg">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>Enter the OTP and your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

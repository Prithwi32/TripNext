"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Palmtree, ArrowRight, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export function VerifyForm() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const verifyEmail = localStorage.getItem("verifyEmail");
    const verifyRole = localStorage.getItem("role");

    if (!verifyEmail) {
      toast.error("Please complete the signup process first");
      router.push("/auth/signup");
      return;
    }
    setEmail(verifyEmail);
    setRole(verifyRole || "user");
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (pastedData.length <= 6 && /^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(30);

    try {
      const endpoint =
        role === "user"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/resend-otp`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/guide/resend-otp`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [role === "user" ? "userEmail" : "guideEmail"]: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("New OTP sent to your email!");

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
      setResendDisabled(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        role === "user"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/verify`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/guide/verify`;
      const otpCode = otp.join("");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [role === "user" ? "userEmail" : "guideEmail"]: email,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      localStorage.removeItem("verifyEmail");
      localStorage.removeItem("role");

      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Account verified successfully!");
      // Redirect to login or dashboard

      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/40 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <Palmtree className="h-5 w-5 text-secondary" />
        </div>
        <CardDescription>
          We've sent a 6-digit code to{" "}
          <span className="font-medium">{email}</span>. Enter the code below to
          verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="h-12 w-12 text-center text-lg"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                required
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-secondary"
            disabled={isLoading || otp.some((digit) => digit === "")}
          >
            {isLoading ? "Verifying..." : "Verify account"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-sm font-medium text-primary"
            onClick={handleResend}
            disabled={resendDisabled}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            {resendDisabled
              ? `Resend code in ${countdown}s`
              : "Resend verification code"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t bg-muted/50 px-8 py-4">
        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder or{" "}
          <Link href="/contact" className="underline underline-offset-2">
            contact support
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

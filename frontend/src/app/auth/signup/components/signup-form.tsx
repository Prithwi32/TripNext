"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Mail, Lock, Phone, ArrowRight, Info } from "lucide-react"

export function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [role, setRole] = useState("user")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/auth/verify")
    }, 1500)
  }

  return (
    <Card className="border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="role">I want to join as a</Label>
            <RadioGroup id="role" value={role} onValueChange={setRole} className="flex space-x-4" defaultValue="user">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user-signup" />
                <Label htmlFor="user-signup" className="cursor-pointer font-normal">
                  Traveler
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="guide" id="guide-signup" />
                <Label htmlFor="guide-signup" className="cursor-pointer font-normal">
                  Guide
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={role === "user" ? "user@example.com" : "guide@example.com"}
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {role === "guide" && (
            <div className="space-y-3">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="+1234567890"
                  className="pl-10"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required={role === "guide"}
                  pattern="^\+?[0-9]{10,15}$"
                />
              </div>
              <p className="text-xs text-muted-foreground">Format: +1234567890 (10-15 digits)</p>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
          </div>

          {role === "guide" && (
            <div className="rounded-md bg-muted/50 p-3">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  As a guide, you'll need to provide additional information about your services and experience after
                  registration.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w- bg-secondary" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const formSchema = z.object({
  userName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  about: z.string().max(500, {
    message: "About must not be longer than 500 characters.",
  }),
});

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    session?.user.profileImage || ""
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      about: "",
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        form.setValue("userName", response.data.data.userName || "");
        form.setValue("about", response.data.data.about || "");
        setProfileImage(response.data.data.profileImage);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.dismiss();
        toast.error("Failed to load user data. Please try again.");
      }
    };

    fetchUserData();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await axiosInstance.patch("/api/user/update", {
        userName: values.userName,
        about: values.about,
        profileImage,
      });

      toast.dismiss();
      toast.success("Your profile has been successfully updated.");

      // Update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          userName: values.userName,
          profileImage: profileImage,
        },
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const generateRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setProfileImage(randomAvatar);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={profileImage}
              alt={session?.user.name || "User"}
            />
            <AvatarFallback>
              {session?.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRandomAvatar}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Random Avatar
          </Button>
        </div>

        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share a brief description about yourself (max 500
                      characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mx-auto md:w-auto" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

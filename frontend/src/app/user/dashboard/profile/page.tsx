"use client";

import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { UserInfo } from "./components/user-info";
import { ProfileForm } from "./components/profile-form";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-6xl pb-20">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="info" className="w-full">
       <TabsList className="mb-4">
          <TabsTrigger value="info">Profile Information</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>View your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ProfileSkeleton />}>
                <UserInfo />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ProfileSkeleton />}>
                <ProfileForm />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-[300px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { BlogsList } from "./components/BlogsList";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyBlogsPage() {
  return (
    <div className="container mx-auto max-w-7xl pb-20 px-3 xs:px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl xs:text-3xl font-bold">My Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Share your travel experiences and stories
          </p>
        </div>
        <Button
          asChild
          className="rounded-full self-start sm:self-center"
          size="sm"
        >
          <Link href="/user/dashboard/blogs/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Blog
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Blog Collection</CardTitle>
            </div>
            <CardDescription>
              View and manage your travel stories
            </CardDescription>
          </CardHeader>

          <CardContent>
            <BlogsList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

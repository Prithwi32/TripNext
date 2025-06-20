"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BlogDetailPublicPage() {
  const { blogid } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/blog/${blogid}`);
        console.log("Fetched Blog:", res.data.data);
        setBlog(res.data.data);
      } catch (err) {
        console.error("Error fetching blog", err);
        setError("Blog not found or access denied.");
      } finally {
        setIsLoading(false);
      }
    };

    if (blogid) fetchBlog();
  }, [blogid]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error || !blog) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto my-8 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <CardTitle className="text-xl font-bold text-center w-full">
            {blog.blogTitle || "Blog Details"}
          </CardTitle>
          <div className="w-[72px]"></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {blog.blogImages.length > 0 && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={blog.blogImages[0]}
              alt="Blog Image"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{blog.blogDescription}</p>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 py-2 px-3 rounded-lg mb-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage
              src={blog.user.profileImage || undefined}
              alt={blog.user.userName}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />

            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {blog.user.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{blog.user.userName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {blog.user.userEmail || "Email unavailable"}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Posted on: {formatDate(new Date(blog.createdAt))}
          </div>
          {blog.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.hashtags.map((tag, i) => (
                <Badge key={i} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Blog } from "../types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Edit, Eye, Trash } from "lucide-react";
import { useState } from "react";

interface BlogCardProps {
  blog: Blog;
  onEdit: (blogId: string) => void;
  onDelete: (blogId: string) => void;
}

export function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
  const formattedDate = formatDate(new Date(blog.createdAt));
  const [isImageError, setIsImageError] = useState(false);

  // Extract first line as title (limited to 60 chars)
  const blogTitle = blog.blogDescription.split("\n")[0].slice(0, 60);

  // Get excerpt for description - shorter excerpt to allow more space for metadata on mobile
  const excerpt =
    blog.blogDescription.length > 80
      ? blog.blogDescription.slice(0, 80) + "..."
      : blog.blogDescription;  return (
    <Card className="overflow-hidden flex flex-col h-full border hover:shadow-md transition-all duration-200 group">
      {/* Blog Image Section */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden">        <Image
          src={isImageError ? "/travel1.avif" : blog.blogImages[0]}
          alt={blogTitle}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          onError={() => setIsImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-500 group-hover:from-black/80" />        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-lg font-semibold text-white line-clamp-2 transition-transform duration-300 group-hover:translate-x-1">
            {blogTitle}
          </h3>
        </div>
      </div>

      {/* Blog Content */}
      <CardContent className="flex-grow p-4 pb-2">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>

      {/* Metadata and Actions Footer */}
      <div className="px-4 pb-1">
        {/* Date and hashtags section - moved directly above buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>

          {blog.hashtags.length > 0 && (
            <>
              <div className="hidden xs:block h-4 w-[1px] bg-border mx-1"></div>
              <div className="flex flex-wrap gap-1">
                {blog.hashtags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-[0.65rem] px-1.5 py-0"
                  >
                    #{tag}
                  </Badge>
                ))}
                {blog.hashtags.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-[0.65rem] px-1.5 py-0"
                  >
                    +{blog.hashtags.length - 2}
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Actions Footer */}
      <CardFooter className="flex justify-between items-center pt-0 pb-4 px-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 px-3 xs:px-4"
          asChild
        >
          <Link href={`/user/dashboard/blogs/${blog._id}`}>
            <Eye className="h-3.5 w-3.5 mr-1 xs:mr-1.5" />
            <span className="text-xs xs:text-sm">View</span>
          </Link>
        </Button>
        <div className="flex gap-1 xs:gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-secondary"
            onClick={() => onEdit(blog._id)}
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/80"
            onClick={() => onDelete(blog._id)}
          >
            <Trash className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

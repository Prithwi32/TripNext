"use client";

import { useEffect, useState } from "react";
import { Blog } from "../types";
import { BlogCard } from "./BlogCard";
import { axiosInstance } from "@/lib/axios";

export default function AllBlogsClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/api/blog/");
        setBlogs(response.data.data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);


  if (loading) return <p className="text-muted-foreground">Loading blogs...</p>;

  if (blogs.length === 0)
    return <p className="text-muted-foreground">No blogs found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
        />
      ))}
    </div>
  );
}

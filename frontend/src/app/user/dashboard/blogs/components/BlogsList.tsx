"use client";

import { useState, useEffect } from "react";
import { blogService } from "../api";
import { Blog } from "../types";
import { BlogCard } from "./BlogCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export function BlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllBlogs();
      setBlogs(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      setError("Failed to load blogs. Please try again later.");
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blogId: string) => {
    router.push(`/user/dashboard/blogs/edit/${blogId}`);
  };

  const handleDelete = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      setIsDeleting(true);
      await blogService.deleteBlog(blogToDelete);
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== blogToDelete)
      );
      toast.success("Blog deleted successfully");
    } catch (err) {
      console.error("Failed to delete blog", err);
      toast.error("Failed to delete blog");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading your blogs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchBlogs} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {blogs.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No blogs found</h3>
          <p className="text-muted-foreground mb-4">
            Share your travel experiences by creating your first blog
          </p>
          <Button asChild>
            <Link href="/user/dashboard/blogs/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Blog
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your blog and all its content. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

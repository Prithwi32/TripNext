"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Comment, CommentUser } from "./types";
import { CommentSeparator } from "./CommentSeparator";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentsProps {
  blogId: string;
}

export default function Comments({ blogId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all comments for the blog
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/api/comment/${blogId}`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // Add a new top-level comment
  const handleAddComment = async (message: string) => {
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post(`/api/comment/add-comment/${blogId}`, {
        message,
      });
      toast.success("Comment posted successfully");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a reply to a comment
  const handleAddReply = async (
    commentId: string,
    message: string,
    toUserId?: string
  ) => {
    if (!session) {
      toast.error("Please sign in to reply");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post(
        `/api/comment/reply-comment/${blogId}/${commentId}`,
        {
          message,
          toUserId,
        }
      );
      toast.success("Reply posted successfully");
      fetchComments();
    } catch (err) {
      console.error("Error posting reply:", err);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update a comment
  const handleUpdateComment = async (commentId: string, message: string) => {
    if (!session) {
      toast.error("Please sign in to edit");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.patch(`/api/comment/update-comment/${commentId}`, {
        message,
      });
      toast.success("Comment updated successfully");
      fetchComments();
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!session) {
      toast.error("Please sign in to delete");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.delete(`/api/comment/delete-comment/${commentId}`);
      toast.success("Comment deleted successfully");
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Check if the user is a guide
  const isGuide = session?.user?.role === "guide";

  return (
    <div className="mt-8 max-w-5xl mx-auto">
      <CommentSeparator commentCount={comments.length} className="mb-6" />
      {/* Add new comment form - only show if user is not a guide */}{" "}
      {!isGuide && (
        <div className="mb-8">
          <CommentForm
            onSubmit={handleAddComment}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
      {/* Show message to guides */}
      {isGuide && session && (
        <div className="mb-8 p-4 bg-muted/30 rounded-md border text-center">
          <p className="text-muted-foreground">
            As a guide, you can view comments but cannot post or reply to
            comments.
          </p>
        </div>
      )}
      {/* Comments list */}
      <div className="border-t border-border pt-2">
        <CommentList
          comments={comments}
          onReply={handleAddReply}
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

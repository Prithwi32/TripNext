"use client";

import { CommentItem } from "./CommentItem";
import { Comment } from "./types";
import { MessageSquarePlus } from "lucide-react";

interface CommentListProps {
  comments: Comment[];
  onReply: (
    commentId: string,
    message: string,
    toUserId?: string
  ) => Promise<void>;
  onUpdate: (commentId: string, message: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  isSubmitting: boolean;
  isLoading: boolean;
}

export function CommentList({
  comments,
  onReply,
  onUpdate,
  onDelete,
  isSubmitting,
  isLoading,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 py-4">
        {[1, 2, 3].map((i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
          <MessageSquarePlus className="h-8 w-8 text-muted-foreground/70" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          No comments yet
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          Be the first to share your thoughts on this blog post!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 divide-y divide-border/30">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onReply={onReply}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
        />
      ))}
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="mb-4 bg-card/50 rounded-md">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2"></div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-3/4 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2 mt-3">
              <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
            </div>

            {/* Simulate some replies */}
            <div className="mt-4 pl-4 border-l-2 border-muted">
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-muted animate-pulse rounded mb-1"></div>
                    <div className="h-2.5 w-full bg-muted animate-pulse rounded"></div>
                    <div className="h-2.5 w-2/3 bg-muted animate-pulse rounded mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

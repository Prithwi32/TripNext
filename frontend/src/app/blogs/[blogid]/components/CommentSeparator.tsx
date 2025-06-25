"use client";

import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface CommentSeparatorProps {
  commentCount: number;
  className?: string;
}

export const CommentSeparator = ({
  commentCount,
  className,
}: CommentSeparatorProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-4 text-lg font-semibold",
        className
      )}
    >
      <MessageSquare className="h-5 w-5" />
      <span>
        {commentCount || 0} {commentCount === 1 ? "Comment" : "Comments"}
      </span>
      <div className="flex-1 h-[1px] bg-border/50"></div>
    </div>
  );
};

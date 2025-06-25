"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquarePlus, Send } from "lucide-react";
import { CommentUser } from "./types";

interface CommentFormProps {
  onSubmit: (message: string) => Promise<void>;
  isSubmitting: boolean;
  placeholder?: string;
  buttonText?: string;
  isReply?: boolean;
  initialValue?: string;
  replyingTo?: CommentUser | null;
  onCancel?: () => void;
}

export function CommentForm({
  onSubmit,
  isSubmitting,
  placeholder = "Share your thoughts...",
  buttonText = "Post Comment",
  isReply = false,
  initialValue = "",
  replyingTo = null,
  onCancel,
}: CommentFormProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState(initialValue);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    await onSubmit(message);
    setMessage("");
  };
  // Check for no session or guide role
  if (!session) {
    return (
      <Card className="shadow-sm border p-6 text-center bg-muted/20">
        <p className="text-base text-muted-foreground mb-4">
          Join the conversation - sign in to comment
        </p>
        <Button size="sm" className="px-8" asChild>
          <a href="/auth/login?callbackUrl=/blogs">Sign in</a>
        </Button>
      </Card>
    );
  }
  
  // Guide users shouldn't be able to comment
  if (session.user.role === "guide") {
    return (
      <Card className="shadow-sm border p-4 bg-muted/20">
        <p className="text-sm text-muted-foreground text-center">
          As a guide, you can view comments but cannot post comments.
        </p>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm border ${isReply ? "shadow-none" : ""}`}>
      <CardContent className={`p-4 ${isReply ? "pb-3 pt-3" : ""}`}>
        {!isReply && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9 border border-border">
              {" "}
              <AvatarImage
                src={session.user.profileImage || undefined}
                alt={session.user.name || ""}
              />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              {" "}
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">
                Comment as {session.user.name}
              </p>
            </div>
          </div>
        )}

        {isReply && replyingTo && (
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage
                src={session?.user?.profileImage || undefined}
                alt={session?.user?.name || "You"}
              />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {session?.user?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs font-medium">
              Replying to{" "}
              <span className="font-bold">{replyingTo.userName}</span>
            </p>
          </div>
        )}

        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            rows={isReply ? 2 : 3}
            className="focus:ring-1 focus:ring-primary/20 resize-none"
          />
          <div className="flex justify-end mt-3 gap-2">
            {isReply && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="h-8"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              className={isReply ? "h-8 px-4" : "px-5"}
              size={isReply ? "sm" : "default"}
              disabled={!message.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span
                    className={`border-2 border-t-transparent border-white rounded-full animate-spin mr-2 ${
                      isReply ? "h-3 w-3" : "h-4 w-4"
                    }`}
                  ></span>
                  {isReply ? "Sending..." : "Posting..."}
                </span>
              ) : (
                <>
                  {isReply ? (
                    <Send className="h-3 w-3 mr-1.5" />
                  ) : (
                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                  )}
                  {buttonText}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

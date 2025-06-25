"use client";

import { useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  X,
  CornerDownRight,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Comment, CommentUser } from "./types";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  onReply: (
    commentId: string,
    message: string,
    toUserId?: string
  ) => Promise<void>;
  onUpdate: (commentId: string, message: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  isSubmitting: boolean;
}

export function CommentItem({
  comment,
  onReply,
  onUpdate,
  onDelete,
  isSubmitting,
}: CommentItemProps) {
  const { data: session } = useSession();
  const [editText, setEditText] = useState(comment.message);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(3); // Initial number of replies to show
  const [editingComment, setEditingComment] = useState<string | null>(null); // Track which reply is being edited
  const [replyToUserInfo, setReplyToUserInfo] = useState<CommentUser | null>(
    null
  );
  const commentUser =
    typeof comment.userId === "object"
      ? comment.userId
      : { _id: "", userName: "Unknown User" };
  const hasReplies = comment.replies && comment.replies.length > 0;
  const totalReplies = comment.replies?.length || 0;
  const showLoadMore =
    hasReplies && visibleReplies < totalReplies && showReplies;

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Check if current user is the owner of the comment
  const isOwner = (user: CommentUser | string) => {
    if (!session) return false;
    const userId = typeof user === "object" ? user._id : user;
    return userId === session.user.id;
  };

  // Handle showing more replies
  const loadMoreReplies = () => {
    setVisibleReplies((prev) => Math.min(prev + 5, totalReplies));
  };

  // Handle submitting a reply
  const handleReplySubmit = async (message: string) => {
    if (!message.trim()) return;

    let finalMessage = message;
    let targetUserId: string | undefined = undefined; // If we're replying to a specific user (not the comment author)
    if (replyToUserInfo && replyToUserInfo._id !== commentUser._id) {
      finalMessage = `@${replyToUserInfo.userName} ${message}`;
      targetUserId = replyToUserInfo._id;
    } else {
      // Default to replying to the comment author
      finalMessage = `@${commentUser.userName} ${message}`;
    }

    await onReply(comment._id, finalMessage, targetUserId);
    setIsReplying(false);
    setReplyToUserInfo(null);
    setShowReplies(true); // Automatically expand replies when a new one is added
  };

  // Handle cancel reply
  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyToUserInfo(null);
  };

  // Handle submitting an edit
  const handleEditSubmit = async () => {
    if (!editText.trim()) return;

    if (editingComment) {
      await onUpdate(editingComment, editText);
    } else {
      await onUpdate(comment._id, editText);
    }

    setIsEditing(false);
    setEditingComment(null);
  };

  // Get user profile image (handles different field names)
  const getUserImage = (user: CommentUser) => {
    return user.profileImage || user.profilePicture;
  };

  // Process message for replies to highlight mentions
  const processReplyMessage = (reply: Comment): ReactNode => {
    // If there's a mention format like @username at the start, highlight it
    const replyToUser =
      typeof reply.toUserId === "object" ? reply.toUserId : null;
    if (replyToUser) {
      const mentionRegex = new RegExp(`^@${replyToUser.userName}\\s`);
      const match = reply.message.match(mentionRegex);

      if (match) {
        const mention = match[0];
        return (
          <>
            <span className="text-primary font-medium">{mention}</span>
            {reply.message.substring(mention.length)}
          </>
        );
      }
    }

    // If the message starts with @ but doesn't match the expected format
    const genericMentionRegex = /^@(\w+)\s/;
    const genericMatch = reply.message.match(genericMentionRegex);
    if (genericMatch) {
      const mention = genericMatch[0];
      return (
        <>
          <span className="text-primary font-medium">{mention}</span>
          {reply.message.substring(mention.length)}
        </>
      );
    }

    return reply.message;
  };

  return (
    <div className="mb-6 border-b border-border/30 pb-4 last:border-0">
      <div className="flex items-start gap-3">
        {" "}
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage
            src={commentUser.profileImage}
            alt={commentUser.userName}
          />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {commentUser.userName?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between mb-1">
            {" "}
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">
                {commentUser.userName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>

          {isEditing && !editingComment ? (
            <div className="space-y-2 mt-1">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="text-sm min-h-[80px] resize-none focus:ring-1 focus:ring-primary/20"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={!editText.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></span>
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap break-words py-1">
                {comment.message}
              </p>{" "}
              <div className="flex items-center mt-1 gap-3">
                {session && session.user.role !== "guide" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground hover:bg-muted/10"
                    onClick={() => {
                      setIsReplying(!isReplying);
                      setReplyToUserInfo(commentUser); 
                      if (isEditing) {
                        setIsEditing(false);
                        setEditingComment(null);
                      }
                    }}
                  >
                    {isReplying && replyToUserInfo?._id === commentUser._id ? (
                      <>
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </>
                    ) : (
                      <>
                        <CornerDownRight className="h-3 w-3 mr-1" /> Reply
                      </>
                    )}
                  </Button>
                )}{" "}
                {isOwner(comment.userId) &&
                  session &&
                  session.user.role !== "guide" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground hover:bg-muted/10"
                        onClick={() => {
                          setIsEditing(true);
                          setEditingComment(null);
                          setEditText(comment.message);
                          setIsReplying(false);
                        }}
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2 text-destructive hover:bg-destructive/90"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment?
                              {hasReplies && (
                                <span className="font-semibold block mt-2">
                                  This will also delete all replies.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(comment._id)}
                              className="bg-destructive hover:bg-destructive/90"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <span className="flex items-center">
                                  <span className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></span>
                                  Deleting...
                                </span>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
              </div>
            </>
          )}

          {/* Reply form */}
          {isReplying && session && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReplySubmit}
                isSubmitting={isSubmitting}
                placeholder="Write your reply..."
                buttonText="Reply"
                isReply={true}
                replyingTo={replyToUserInfo || commentUser}
                onCancel={handleCancelReply}
              />
            </div>
          )}

          {/* Replies section */}
          {hasReplies && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-xs h-8 px-2 text-primary hover:text-primary/90 hover:bg-primary/5 mb-1"
                onClick={() => setShowReplies(!showReplies)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {showReplies ? "Hide" : "Show"} {totalReplies}{" "}
                {totalReplies === 1 ? "reply" : "replies"}
                {showReplies ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </Button>

              {showReplies && (
                <div className="space-y-3 pl-4 mt-2 border-l-2 border-border/20">
                  {" "}
                  {comment.replies?.slice(0, visibleReplies).map((reply) => {
                    const replyUser =
                      typeof reply.userId === "object"
                        ? reply.userId
                        : { _id: "", userName: "Unknown User" };
                    return (
                      <div
                        key={reply._id}
                        className="flex items-start gap-2 mb-2 last:mb-0"
                      >
                        <Avatar className="h-7 w-7 border border-border">
                          {" "}
                          <AvatarImage
                            src={getUserImage(replyUser)}
                            alt={replyUser.userName}
                          />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {replyUser.userName?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {isEditing && editingComment === reply._id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={2}
                                className="text-sm resize-none focus:ring-1 focus:ring-primary/20"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleEditSubmit}
                                  disabled={!editText.trim() || isSubmitting}
                                  className="h-7 text-xs px-3"
                                >
                                  {isSubmitting ? (
                                    <span className="flex items-center">
                                      <span className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></span>
                                      Saving...
                                    </span>
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setIsEditing(false);
                                    setEditingComment(null);
                                  }}
                                  disabled={isSubmitting}
                                  className="h-7 text-xs px-3"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-x-1.5">
                                    {" "}
                                    <span className="font-medium text-xs">
                                      {replyUser.userName}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-xs whitespace-pre-wrap break-words mt-0.5">
                                    {processReplyMessage(reply)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center mt-1 gap-2">
                                {" "}
                                {session && session.user.role !== "guide" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] px-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/10"
                                    onClick={() => {
                                      setIsReplying(true);
                                      setIsEditing(false);
                                      setEditingComment(null);
                                      setReplyToUserInfo(replyUser);
                                    }}
                                  >
                                    <CornerDownRight className="h-2.5 w-2.5 mr-1" />{" "}
                                    Reply
                                  </Button>
                                )}{" "}
                                {isOwner(reply.userId) &&
                                  session &&
                                  session.user.role !== "guide" && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-[10px] px-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/10"
                                        onClick={() => {
                                          setIsEditing(true);
                                          setEditingComment(reply._id);
                                          setEditText(reply.message);
                                          setIsReplying(false);
                                        }}
                                      >
                                        <Pencil className="h-2.5 w-2.5 mr-1" />{" "}
                                        Edit
                                      </Button>

                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-[10px] px-1.5 text-destructive hover:bg-destructive/90"
                                          >
                                            <Trash2 className="h-2.5 w-2.5 mr-1" />{" "}
                                            Delete
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Delete Reply
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete
                                              this reply?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                onDelete(reply._id)
                                              }
                                              className="bg-destructive hover:bg-destructive/90"
                                              disabled={isSubmitting}
                                            >
                                              {isSubmitting ? (
                                                <span className="flex items-center">
                                                  <span className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></span>
                                                  Deleting...
                                                </span>
                                              ) : (
                                                "Delete"
                                              )}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </>
                                  )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {showLoadMore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-xs text-primary hover:text-primary/90 hover:bg-primary/5"
                      onClick={loadMoreReplies}
                    >
                      Load more replies...
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

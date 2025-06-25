"use client";
import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import socket from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

interface ChatDialogProps {
  receiverId: string;
  userName?: string;
  userPhoto?: string;
}

interface Message {
  _id: string;
  message: string;
  sender: {
    _id: string;
    userName?: string;
    guideName?: string;
    profileImage?: string;
    userEmail?: string;
    guideEmail?: string;
  };
  createdAt: string;
  conversationId: string;
}

export default function ChatDialog({
  receiverId,
  userName,
  userPhoto,
}: ChatDialogProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = session?.user?.id;
  const currentUserEmail = session?.user?.email;

  const conversationId = useMemo(() => {
    return [currentUserId, receiverId].sort().join("_");
  }, [currentUserId, receiverId]);

  useEffect(() => {
    if (!socket || !conversationId || !open) return;

    const handleNewMessage = (newMsg: Message) => {
      if (newMsg.conversationId === conversationId) {
        setMessages((prev) => {
          const filtered = prev.filter(
            (msg) =>
              !(
                msg._id.startsWith("temp-") &&
                msg.message === newMsg.message &&
                msg.sender._id === newMsg.sender._id
              )
          );
          if (!filtered.some((msg) => msg._id === newMsg._id)) {
            return [...filtered, newMsg];
          }
          return filtered;
        });
      }
    };

    socket.emit("joinRoom", conversationId);

    socket.on("newMessage", handleNewMessage);

    const handleMessageDeleted = ({
      messageId,
      conversationId: deletedConvId,
    }: {
      messageId: string;
      conversationId: string;
    }) => {
      if (deletedConvId === conversationId) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    };

    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.emit("leaveRoom", conversationId);
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, conversationId, open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/chat/getChat/${conversationId}`
      );
      setMessages(res.data.data || []);
    } catch {
      toast.error("Failed to load chat");
    }
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
      if (socket && conversationId) {
        socket.emit("joinRoom", conversationId);
      }
    }
  }, [open, conversationId]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create optimistic message
    const optimisticMessage: Message = {
      _id: `temp-${Date.now()}`,
      message: inputValue,
      sender: {
        _id: currentUserId || "",
        [currentUserEmail?.includes("@guide.com") ? "guideEmail" : "userEmail"]:
          currentUserEmail || "",
        [currentUserEmail?.includes("@guide.com") ? "guideName" : "userName"]:
          session?.user?.name || "",
        profileImage: session?.user?.profileImage || "",
      },
      createdAt: new Date().toISOString(),
      conversationId,
    };

    // Add optimistic message to UI immediately
    setMessages((prev) => [...prev, optimisticMessage]);
    setInputValue("");

    try {
      setSending(true);
      const res = await axiosInstance.post(
        `/api/chat/sendMessage/${receiverId}`,
        { message: inputValue, senderRole: "User" }
      );

      // Replace optimistic message with actual message from server
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === optimisticMessage._id ? res.data.data : msg
        )
      );
    } catch {
      toast.error("Message not sent");
      // Remove optimistic message if send fails
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticMessage._id)
      );
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await axiosInstance.delete(`/api/chat/deleteMessage/${messageId}`, {
        data: { senderRole: "User" },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    if (session?.user?.id && session?.user?.token) {
      socket.auth = { token: session.user.token };
      socket.io.opts.query = { userId: session.user.id };
      if (!socket.connected) socket.connect();
      socket.emit("registerUser", session.user.id);
    }
  }, [session]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-950 fixed bottom-4 right-4 shadow-lg z-50"
        >
          <MessageCircle className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0">
        <div className="flex flex-col h-[500px]">
          <div className="flex items-center gap-4 border-b p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userPhoto} />
              <AvatarFallback>{userName?.charAt(0) || "G"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{userName || "Guide"}</h3>
              <p className="text-sm text-muted-foreground">Start chatting</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const currentUserEmail = session?.user?.email;
              const isSender =
                msg.sender?.userEmail === currentUserEmail ||
                msg.sender?.guideEmail === currentUserEmail;

              return (
                <div
                  key={msg._id}
                  className={`group flex items-start gap-2 ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isSender && (
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarImage src={msg.sender?.profileImage} />
                      <AvatarFallback>
                        {msg.sender?.userName?.[0] ||
                          msg.sender?.guideName?.[0] ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`px-3 py-2 rounded-lg max-w-[75%] text-sm relative border border-blue-400 ${
                      isSender ? "bg-blue-950 text-white" : "bg-muted"
                    }`}
                  >
                    {msg.message}
                    <div className="text-[10px] text-muted-foreground text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {isSender && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                        title="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t p-4 flex items-end gap-2"
          >
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="resize-none"
              rows={1}
              disabled={isSending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              className="bg-blue-950 text-white"
              disabled={isSending || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

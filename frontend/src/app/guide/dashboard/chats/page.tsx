"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { socket } from "@/lib/socket";
import { useMemo } from "react";
import UserList from "./chat/UserList";
import { User, Message, GuideChatInterfaceProps } from "./chat/types";
import ChatPanel from "./chat/ChatPanel";
import { useSession } from "next-auth/react";

export default function GuideChatInterface({
  currentUser,
}: GuideChatInterfaceProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = session?.user?.id;
  const currentUserEmail = session?.user?.email;

  console.log(session);

  const conversationId = useMemo(() => {
    return selectedUser
      ? [currentUserId, selectedUser._id].sort().join("_")
      : "";
  }, [currentUserId, selectedUser]);

  useEffect(() => {
    if (!socket || !conversationId || !open) return;

    const handleNewMessage = (newMsg: Message) => {
      if (newMsg.conversationId === conversationId) {
        setMessages((prev) => {
          if (!prev.some((msg) => msg._id === newMsg._id)) {
            return [...prev, newMsg];
          }
          return prev;
        });
      }
    };

    socket.emit("joinRoom", conversationId);

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveRoom", conversationId);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, conversationId, open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/api/chat/guide/chats");

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch chat users");
      }

      const users = res.data.data;
      if (!Array.isArray(users)) {
        throw new Error("Invalid response format: expected array of users");
      }

      const mapped: User[] = users.map((u: any) => ({
        _id: u._id,
        email: u.email,
        name: u.name,
        photo: u.photo || undefined,
      }));

      setUsers(mapped);
    } catch (error: any) {
      console.error("Error fetching chat users:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load chat users"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    const convoId = [currentUserId, userId].sort().join("_");
    try {
      console.log(convoId);
      const res = await axiosInstance.get(`/api/chat/getChat/${convoId}`);
      setMessages(res.data.data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load messages"
      );
    }
  };

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setMessages([]);
    await fetchMessages(user._id);

    // Join socket room for real-time updates
    if (socket && currentUserId) {
      const convoId = [currentUserId, user._id].sort().join("_");
      socket.emit("joinRoom", convoId);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!selectedUser || !messageText.trim() || isSending) return;

    // Create optimistic message
    const optimisticMessage: Message = {
      _id: `temp-${Date.now()}`,
      message: messageText,
      sender: {
        _id: currentUserId || "",
        guideEmail: currentUserEmail || "",
        guideName: currentUser?.name || "",
        profileImage: currentUser?.image || "",
      },
      receiver: {
        _id: selectedUser._id,
        userEmail: selectedUser.email,
        userName: selectedUser.name,
        profileImage: selectedUser.photo || "",
      },
      createdAt: new Date().toISOString(),
      conversationId: conversationId,
    };

    // Add optimistic message to UI immediately
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      setSending(true);
      const res = await axiosInstance.post(
        `/api/chat/sendMessage/${selectedUser._id}`,
        { message: messageText, senderRole: "Guide" }
      );

      // Replace optimistic message with actual message from server
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === optimisticMessage._id ? res.data.data : msg
        )
      );
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(
        error.response?.data?.message || error.message || "Message not sent"
      );
      // Remove optimistic message if send fails
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticMessage._id)
      );
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/chat/deleteMessage/${id}`, {
        data: { senderRole: "Guide" },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      toast.success("Message deleted");
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast.error(
        error.response?.data?.message || error.message || "Delete failed"
      );
    }
  };

  useEffect(() => {
    if (open) {
      fetchChatUsers();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-primary fixed bottom-4 right-4 shadow-lg z-50 hover:bg-primary/90"
        >
          <MessageCircle className="h-5 w-5 text-primary-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 max-w-6xl w-full h-[600px]">
        <div className="flex h-full bg-background">
          <UserList
            users={users}
            selectedUser={selectedUser}
            isLoading={isLoading}
            onUserSelect={handleUserSelect}
          />
          <ChatPanel
            selectedUser={selectedUser}
            messages={messages}
            currentUserEmail={currentUserEmail}
            isSending={isSending}
            onSendMessage={sendMessage}
            onDeleteMessage={deleteMessage}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

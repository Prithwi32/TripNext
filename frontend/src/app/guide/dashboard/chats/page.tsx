// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Send, MessageCircle, Trash2 } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { axiosInstance } from "@/lib/axios";
// import toast from "react-hot-toast";
// import { socket } from "@/lib/socket";
// import { useSession } from "next-auth/react";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   photo?: string;
// }

// interface Message {
//   _id: string;
//   message: string;
//   sender: string;
//   createdAt: string;
//   conversationId: string;
// }

// export default function GuideChatInterface() {
//   const { data: session, status } = useSession();
//   const [open, setOpen] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isSending, setSending] = useState(false);
//   const [search, setSearch] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const currentUserId = session?.user?.id;

//   const conversationId = selectedUser
//     ? [currentUserId, selectedUser._id].sort().join("_")
//     : "";

//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     socket.emit("joinRoom", conversationId);

//     const handleNewMessage = (newMsg: Message) => {
//       if (newMsg.conversationId === conversationId) {
//         setMessages((prev) => [...prev, newMsg]);
//       }
//     };

//     socket.on("newMessage", handleNewMessage);

//     return () => {
//       socket?.off("newMessage", handleNewMessage);
//     };
//   }, [selectedUser, conversationId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const fetchChatUsers = async () => {
//     try {
//       const res = await axiosInstance.get("/api/chat/guide/chats");
//       const users = res.data.data;
//       const mapped: User[] = users.map((u: any) => ({
//         _id: u._id,
//         email: u.email,
//         name: u.name,
//         photo: u.photo || undefined,
//       }));
//       setUsers(mapped);
//       setFilteredUsers(mapped);
//     } catch {
//       toast.error("Failed to load chat users");
//     }
//   };

//   const fetchMessages = async (userId: string) => {
//     const convoId = [currentUserId, userId].sort().join("_");
//     try {
//       const res = await axiosInstance.get(`/api/chat/getChat/${convoId}`);
//       setMessages(res.data.data || []);
//     } catch {
//       toast.error("Failed to load messages");
//     }
//   };

//   const handleUserSelect = async (user: User) => {
//     setSelectedUser(user);
//     setMessages([]);
//     await fetchMessages(user._id);
//   };

//   const sendMessage = async () => {
//     if (!selectedUser) return;
//     try {
//       setSending(true);
//       await axiosInstance.post(`/api/chat/sendMessage/${selectedUser._id}`, {
//         message: inputValue,
//       });
//       setInputValue("");
//       // Message will come through socket
//     } catch {
//       toast.error("Message not sent");
//     } finally {
//       setSending(false);
//     }
//   };

//   const deleteMessage = async (id: string) => {
//     try {
//       await axiosInstance.delete(`/api/chat/deleteMessage/${id}`);
//       setMessages((prev) => prev.filter((msg) => msg._id !== id));
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   useEffect(() => {
//     if (open) fetchChatUsers();
//   }, [open]);

//   useEffect(() => {
//     const filtered = users.filter((u) =>
//       (u.name || "").toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [search, users]);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           size="icon"
//           className="h-12 w-12 rounded-full bg-blue-950 fixed bottom-4 right-4 shadow-lg z-50"
//         >
//           <MessageCircle className="h-5 w-5 text-white" />
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="p-0 max-w-6xl w-full h-[600px]">
//         <div className="flex h-full bg-background">
//           {/* Sidebar */}
//           <div className="w-1/3 border-r flex flex-col">
//             <div className="p-4 border-b">
//               <Input
//                 placeholder="Search users..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//             <div className="overflow-y-auto flex-1">
//               {filteredUsers.map((user) => (
//                 <div
//                   key={user._id}
//                   className={`flex items-center gap-4 px-4 py-3 cursor-pointer border-b hover:bg-accent ${
//                     selectedUser?._id === user._id ? "bg-muted" : ""
//                   }`}
//                   onClick={() => handleUserSelect(user)}
//                 >
//                   <Avatar className="h-9 w-9">
//                     <AvatarImage src={user.photo} />
//                     <AvatarFallback>
//                       {user?.name?.charAt(0) || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <div className="font-medium">{user.name}</div>
//                     <div className="text-xs text-muted-foreground truncate max-w-[180px]">
//                       {user.email}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           {/* Chat Panel */}
//           <div className="w-full md:w-2/3 flex flex-col h-full">
//             {selectedUser ? (
//               <>
//                 {/* Header */}
//                 <div className="flex items-center gap-4 p-4 border-b bg-background">
//                   <Avatar>
//                     <AvatarImage src={selectedUser.photo} />
//                     <AvatarFallback>
//                       {selectedUser?.name?.charAt(0) || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{selectedUser.name}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {selectedUser.email}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Messages */}
//                 <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
//                   {messages.map((msg) => {
//                     const isSender = msg.sender === currentUserId;
//                     return (
//                       <div
//                         key={msg._id}
//                         className={`group flex ${
//                           isSender ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`relative px-4 py-2 rounded-lg text-sm max-w-xs md:max-w-sm ${
//                             isSender ? "bg-blue-950 text-white" : "bg-muted"
//                           }`}
//                         >
//                           {msg.message}
//                           <div className="text-[10px] text-muted-foreground text-right mt-1">
//                             {new Date(msg.createdAt).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </div>
//                           {isSender && (
//                             <button
//                               onClick={() => deleteMessage(msg._id)}
//                               className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
//                               title="Delete message"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input Area */}
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     if (inputValue.trim()) sendMessage();
//                   }}
//                   className="p-4 border-t bg-background flex gap-2"
//                 >
//                   <Textarea
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     placeholder="Type your message..."
//                     className="resize-none flex-1 rounded-md border border-muted-foreground focus:border-blue-950"
//                     rows={1}
//                     disabled={isSending}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && !e.shiftKey) {
//                         e.preventDefault();
//                         sendMessage();
//                       }
//                     }}
//                   />
//                   <Button
//                     type="submit"
//                     className="bg-blue-950 text-white px-4 py-2"
//                     disabled={isSending || !inputValue.trim()}
//                   >
//                     <Send className="h-4 w-4" />
//                   </Button>
//                 </form>
//               </>
//             ) : (
//               <div className="flex items-center justify-center flex-1 text-muted-foreground p-4">
//                 Select a user to start chatting
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

interface Message {
  _id: string;
  message: string;
  sender: {
    _id: string;
    userName?: string;
    guideName?: string;
    userEmail?: string;
    guideEmail?: string;
    profileImage?: string;
  };
  receiver: {
    _id: string;
    userName?: string;
    guideName?: string;
    userEmail?: string;
    guideEmail?: string;
    profileImage?: string;
  };
  createdAt: string;
  conversationId: string;
}

export default function GuideChatInterface() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = session?.user?.id;
  const currentUserEmail = session?.user?.email;

  const conversationId = useMemo(() => {
    return selectedUser ? [currentUserId, selectedUser._id].sort().join("_") : "";
  }, [currentUserId, selectedUser]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (newMsg: Message) => {
      if (newMsg.conversationId === conversationId) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatUsers = async () => {
    try {
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
      setFilteredUsers(mapped);
    } catch (error: any) {
      console.error("Error fetching chat users:", error);
      toast.error(error.message || "Failed to load chat users");
    }
  };

  const fetchMessages = async (userId: string) => {
    const convoId = [currentUserId, userId].sort().join("_");
    try {
      const res = await axiosInstance.get(`/api/chat/getChat/${convoId}`);
      setMessages(res.data.data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error(error.message || "Failed to load messages");
    }
  };

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setMessages([]);
    await fetchMessages(user._id);
    if (socket && currentUserId) {
      const convoId = [currentUserId, user._id].sort().join("_");
      socket.emit("joinRoom", convoId);
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || !inputValue.trim()) return;
    
    // Create optimistic message
    const optimisticMessage: Message = {
      _id: Date.now().toString(), // Temporary ID
      message: inputValue,
      sender: {
        _id: currentUserId || "",
        guideEmail: currentUserEmail || "",
        guideName: session?.user?.name || "",
        profileImage: session?.user?.image || "",
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
    setInputValue("");
    
    try {
      setSending(true);
      const res = await axiosInstance.post(
        `/api/chat/sendMessage/${selectedUser._id}`,
        { message: inputValue }
      );
      
      // Replace optimistic message with actual message from server
      setMessages((prev) => 
        prev.map(msg => 
          msg._id === optimisticMessage._id ? res.data.data : msg
        )
      );
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Message not sent");
      // Remove optimistic message if send fails
      setMessages((prev) => prev.filter(msg => msg._id !== optimisticMessage._id));
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/chat/deleteMessage/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast.error(error.message || "Delete failed");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to access chat");
      setOpen(false);
      return;
    }

    if (open && status === "authenticated") {
      fetchChatUsers();
    }
  }, [open, status]);

  useEffect(() => {
    const filtered = users.filter((u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

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

      <DialogContent className="p-0 max-w-6xl w-full h-[600px]">
        <div className="flex h-full bg-background">
          {/* Sidebar */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center gap-4 px-4 py-3 cursor-pointer border-b hover:bg-accent ${
                    selectedUser?._id === user._id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photo} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Panel */}
          <div className="w-full md:w-2/3 flex flex-col h-full">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-4 p-4 border-b bg-background">
                  <Avatar>
                    <AvatarImage src={selectedUser.photo} />
                    <AvatarFallback>
                      {selectedUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {messages.map((msg) => {
                    const isSender =
                      msg.sender?.guideEmail === currentUserEmail ||
                      msg.sender?.userEmail === currentUserEmail;

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
                          className={`px-3 py-2 rounded-lg max-w-[75%] text-sm relative ${
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

                {/* Input Area */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputValue.trim()) sendMessage();
                  }}
                  className="p-4 border-t bg-background flex gap-2"
                >
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="resize-none flex-1 rounded-md border border-muted-foreground focus:border-blue-950"
                    rows={1}
                    disabled={isSending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-950 text-white px-4 py-2"
                    disabled={isSending || !inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-muted-foreground p-4">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
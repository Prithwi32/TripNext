import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
  currentUserEmail?: string;
  onDeleteMessage: (id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessages({
  messages,
  currentUserEmail,
  onDeleteMessage,
  messagesEndRef,
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
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
                  {(
                    msg.sender?.userName?.[0] ||
                    msg.sender?.guideName?.[0] ||
                    "U"
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] text-sm relative border border-blue-300 ${
                isSender ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.message}
              </div>
              <div
                className={`text-[10px] mt-1 ${
                  isSender
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {isSender && (
                <button
                  onClick={() => onDeleteMessage(msg._id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity bg-background rounded-full p-1 shadow-md"
                  title="Delete message"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

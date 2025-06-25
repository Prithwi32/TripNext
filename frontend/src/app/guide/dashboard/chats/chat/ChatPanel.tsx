import { MessageCircle } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { User, Message } from "./types";
import { useEffect } from "react";

interface ChatPanelProps {
  selectedUser: User | null;
  messages: Message[];
  currentUserEmail?: string;
  isSending: boolean;
  onSendMessage: (message: string) => void;
  onDeleteMessage: (id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatPanel({
  selectedUser,
  messages,
  currentUserEmail,
  isSending,
  onSendMessage,
  onDeleteMessage,
  messagesEndRef,
}: ChatPanelProps) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="w-2/3 flex flex-col h-full">
        <div className="flex items-center justify-center flex-1 text-muted-foreground p-4">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a user to start chatting</p>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col h-full max-h-[600px] min-h-[400px]">
      <ChatHeader user={selectedUser} />
      <div className="flex-1 overflow-y-auto min-h-0 max-h-[450px]">
        <ChatMessages
          messages={messages}
          currentUserEmail={currentUserEmail}
          onDeleteMessage={onDeleteMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <ChatInput onSendMessage={onSendMessage} isSending={isSending} />
    </div>
  );
}

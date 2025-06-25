import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export default function ChatInput({ onSendMessage, isSending }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isSending) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t bg-background flex gap-2"
    >
      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        className="resize-none flex-1 rounded-md min-h-[40px] max-h-[120px]"
        rows={1}
        disabled={isSending}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim() && !isSending) {
              onSendMessage(inputValue.trim());
              setInputValue("");
            }
          }
        }}
      />
      <Button
        type="submit"
        className="px-4 py-2 self-end"
        disabled={isSending || !inputValue.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}

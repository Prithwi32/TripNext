import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "./types";

interface ChatHeaderProps {
  user: User;
}

export default function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b bg-background">
      <Avatar>
        <AvatarImage src={user.photo} />
        <AvatarFallback>
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">
          {user.email}
        </p>
      </div>
    </div>
  );
}

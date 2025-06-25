import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User } from "./types";

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  onUserSelect: (user: User) => void;
}

export default function UserList({ users, selectedUser, isLoading, onUserSelect }: UserListProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-1/3 border-r flex flex-col">
      <div className="p-4 border-b">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Loading chats...</div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">
              {search ? "No users found" : "No chats yet"}
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center gap-4 px-4 py-3 cursor-pointer border-b hover:bg-accent transition-colors ${
                selectedUser?._id === user._id ? "bg-muted" : ""
              }`}
              onClick={() => onUserSelect(user)}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photo} />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

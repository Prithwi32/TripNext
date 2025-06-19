"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, User } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface UserData {
  _id: string;
  userName: string;
  userEmail: string;
  about: string;
  profileImage: string;
  createdAt: string;
}

export function UserInfo() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/user");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.dismiss();
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="space-y-6">
      {" "}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="shrink-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData.profileImage} alt={userData.userName} />
            <AvatarFallback>{userData.userName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>{" "}
        <div className="space-y-4 text-center sm:text-left w-full">
          <div className="max-w-full">
            <h2 className="text-2xl font-bold truncate">{userData.userName}</h2>
            <p className="text-muted-foreground">
              Member since {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={userData.userEmail}
            />
            <InfoCard
              icon={<User className="h-5 w-5" />}
              label="Username"
              value={userData.userName}
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">About</h3>
        <p className="text-muted-foreground">
          {userData.about || "No information provided."}
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="shrink-0 text-muted-foreground">{icon}</div>
        <div className="min-w-0 w-full">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium truncate" title={value}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

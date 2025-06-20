"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarClock, FileText, Map, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Activity, UserActivityResponse, userService } from "./api";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session } = useSession();
  const currentHour = new Date().getHours();
  const [loading, setLoading] = useState(true);
  const [userActivity, setUserActivity] = useState<UserActivityResponse>({
    stats: { tripCount: 0, blogCount: 0, commentCount: 0 },
    recentActivity: [],
  });

  // Fetch user activity on page load
  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const data = await userService.getRecentActivity();
        setUserActivity(data);
      } catch (error) {
        console.error("Error fetching user activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await userService.getRecentActivity();
      setUserActivity(data);
    } catch (error) {
      console.error("Error refreshing user activity:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine greeting based on time of day
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  return (
    <div className="container mx-auto max-w-7xl pb-20 px-4 sm:px-6">
      {/* Welcome Section with Gradient Background */}
      <div className="relative mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.8))]" />
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            {greeting},{" "}
            <span className="text-primary">{session?.user.name}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Welcome to your personal dashboard. Explore your trips, manage your
            profile, or create new travel experiences.
          </p>

          <div className="mt-4 flex gap-3">
            <Link href="/user/dashboard/trips/create">
              <Button variant="default" size="sm" className="gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                Add New Trip
              </Button>
            </Link>
            <Link href="/user/dashboard/trips">
              <Button variant="outline" size="sm">
                View Your Trips
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Dashboard Cards */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="My Profile"
          description="View and edit your profile information"
          icon={<User className="h-6 w-6" />}
          href="/user/dashboard/profile"
          color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="My Trips"
          description="Manage your trips and itineraries"
          icon={<Map className="h-6 w-6" />}
          href="/user/dashboard/trips"
          color="bg-green-500/10 text-green-600 dark:text-green-400"
        />
        <DashboardCard
          title="My Blogs"
          description="View and edit your travel blogs"
          icon={<FileText className="h-6 w-6" />}
          href="/user/dashboard/blogs"
          color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
      </div>{" "}
      {/* Recent Activity Section with Stats */}
      <div className="mt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Recent Activity & Stats</h2>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 sm:mt-0"
            onClick={handleRefresh}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`mr-1 ${loading ? "animate-spin" : ""}`}
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21h5v-5"></path>
            </svg>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/30">
            <CardContent className="p-4 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Total Trips
                </p>
                <p className="text-2xl font-bold">
                  {userActivity.stats.tripCount}
                </p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-800/30 p-2 rounded-full">
                <Map className="text-amber-600 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30">
            <CardContent className="p-4 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Blogs
                </p>
                <p className="text-2xl font-bold">
                  {userActivity.stats.blogCount}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded-full">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20 border-sky-200 dark:border-sky-800/30">
            <CardContent className="p-4 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
                  Comments
                </p>
                <p className="text-2xl font-bold">
                  {userActivity.stats.commentCount}
                </p>
              </div>
              <div className="bg-sky-100 dark:bg-sky-800/30 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sky-600 dark:text-sky-400"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Card */}
        <Card className="border-muted/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your recent activities on TripNext
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : userActivity.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {userActivity.recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-muted/50 p-3 rounded-full mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M17.2 20a6 6 0 0 0-11.2-3"></path>
                    <path d="m21 3-9 9"></path>
                    <path d="m12 12 4 10"></path>
                    <path d="M9 7H2"></path>
                    <path d="M3.5 3.5 7 7 3.5 10.5"></path>
                  </svg>
                </div>
                <p className="text-muted-foreground mb-2">
                  No recent activity found
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Start planning a trip or writing a blog to see your activity
                  here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const iconMap = {
    trip: <Map className="h-4 w-4" />,
    blog: <FileText className="h-4 w-4" />,
  };

  const typeColors = {
    trip: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    blog: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };

  // Format date
  const formattedDate = new Date(activity.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="flex gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      {activity.image ? (
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-md bg-muted/50">
          {activity.type === "trip" ? (
            <Map className="h-6 w-6 text-muted-foreground" />
          ) : (
            <FileText className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              typeColors[activity.type as keyof typeof typeColors]
            }`}
          >
            {activity.type === "trip" ? "Trip" : "Blog"}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CalendarClock className="h-3 w-3" /> {formattedDate}
          </span>
        </div>
        <Link
          href={`/user/dashboard/${
            activity.type === "trip" ? "trips" : "blogs"
          }/${activity.id}`}
          className="font-medium hover:text-primary transition-colors line-clamp-1"
        >
          {activity.title}
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {activity.description}
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  href,
  color = "bg-primary/10 text-primary",
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}) {
  return (
    <Card className="overflow-hidden group transition-all duration-200 hover:shadow-md border-muted/40 hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${color}`}>{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        <Link href={href}>
          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View {title}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

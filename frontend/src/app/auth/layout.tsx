import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(NEXT_AUTH);
  if (session) {
    redirect("/");
  }
  
  return <>{children}</>;
}

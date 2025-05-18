import Image from "next/image";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-card dark:bg-card-dark">
        <div className="hidden md:flex md:w-1/2 relative bg-primary/10 dark:bg-primary/20 p-6">
          <Image src="/u.avif" alt="Travel Illustration" fill priority />
        </div>
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

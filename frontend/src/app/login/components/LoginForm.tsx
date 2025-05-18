// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 40 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.6 }}
//       className="space-y-6"
//     >
//       <div className="text-center space-y-2">
//         <h2 className="text-3xl font-bold text-teal-700">Welcome Back 🌍</h2>
//         <p className="text-slate-500 text-sm">
//           Login to explore and plan your next adventure.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="password">Password</Label>
//           <div className="relative">
//             <Input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-2.5 text-gray-500"
//               onClick={() => setShowPassword((prev) => !prev)}
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         <Button
//           type="submit"
//           className="w-full bg-secondary hover:bg-orange-600 text-white py-6"
//           disabled={loading}
//         >
//           {loading ? "Signing in..." : "Login"}
//         </Button>
//       </form>

//       <div className="text-sm text-center text-slate-600">
//         Don't have an account?{" "}
//         <Link href="/signup" className="text-primary hover:underline">
//           Sign up
//         </Link>
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import DarkModeButton from "@/components/DarkModeButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle login logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 relative"
    >
      <div className="absolute top-0 right-0">
        <DarkModeButton />
      </div>
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-400">
          Welcome Back 🌍
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Login to explore and plan your next adventure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="dark:text-slate-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <Label htmlFor="password" className="dark:text-slate-300">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-secondary hover:bg-orange-600 dark:bg-secondary-dark dark:hover:bg-orange-500 text-white py-6"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <div className="text-sm text-center text-slate-600 dark:text-slate-400">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-primary hover:underline dark:text-primary-dark"
        >
          Sign up
        </Link>
      </div>
    </motion.div>
  );
}

import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import { axiosInstance } from "./axios";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
  interface User {
    role?: string | null;
  }
}

export const NEXT_AUTH: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
    async authorize(credentials) {
      if (!credentials) return null;
      const { email, password, role } = credentials as {
        email: string;
        password: string;
        role: string;
      };

      try {
        const response = await axiosInstance.post("/auth/login", {
        email,
        password,
        role,
        });

        if (response.data && response.data.user) {
        return {
          id: response.data.user.id as string,
          email: response.data.user.email as string,
          role: response.data.user.role as string,
        } as User;
        }

        throw new Error(response.data?.message || "Authentication failed");
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
        }
        throw new Error(error.message || "Authentication failed");
      }
    },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, 
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = (user as User).email;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
        (session.user as any).role = token.role as string;
      } else if (token) {
        session.user = {
          email: token.email as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
};

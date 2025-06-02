import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { axiosInstance } from "./axios";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }
  interface User {
    id: string;
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
        
        const { email, password, role } = credentials;
        const endpoint = role === "guide" ? "/api/guide/login" : "/api/user/login";
        const data = role === "guide" 
          ? { guideEmail: email, password }
          : { userEmail: email, password };

        try {
          const response = await axiosInstance.post(endpoint, data);
          
          if (response.data?.user) {
            return {
              id: response.data.user._id || response.data.user.id,
              email: response.data.user.email,
              role: response.data.user.role,
              name: response.data.user.name
            };
          }
          throw new Error(response.data?.message || "Authentication failed");
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Authentication failed");
        }
      },
    }),
  ],
   session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encode: async ({ secret, token }) => {
      return jwt.sign(token!, secret, { algorithm: 'HS256' });
    },
    decode: async ({ secret, token }) => {
      return jwt.verify(token as string, secret, { algorithms: ['HS256'] }) as any;
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.email=  user.email
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role as string,
        name: token.name as string,
      };
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};
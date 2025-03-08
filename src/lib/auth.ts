import NextAuth, { Account, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(params: {
      user: User | AdapterUser;
    account: Account | null;
    }) {
      if (!params.user.email) {
        return false;
      }
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: params.user.email },
        });

        if (!existingUser) {
          if (!params.account || !params.account.provider) {
            console.log("Account provider is missing");
            return false;
          }
          const providerEnum =
            params.account.provider === "google" ? "Google" : null;

          if (!providerEnum) {
            console.log("Invalid provider:", params.account.provider);
            return false;
          }

          await prisma.user.create({
            data: {
              email: params.user.email,
              role: "User", // Ensure it's a valid enum value
              provider: providerEnum as "Google", // Explicitly cast to Provider enum
            },
          });
        }
      } catch (error) {
        console.error("Error creating/fetching user:", error);
        return false;
      }
      return true;
    },

    async jwt({ user, token }: any) {
      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true }, // Fetch the UUID explicitly
        });

        if (existingUser) {
          token.id = existingUser.id; // Ensure token.id is the correct UUID string
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user && token.id) {
        session.user.id = String(token.id); // Ensure ID is always a string
      }
      return session;
    },
  },
};

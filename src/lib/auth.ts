import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const providerEnum = account.provider === "google" ? "Google" : null;

          if (!providerEnum) {
            console.log("Invalid provider:", account.provider);
            return false;
          }

          await prisma.user.create({
            data: {
              email: user.email,
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

    async jwt({ user, token }) {
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

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id); // Ensure ID is always a string
      }
      return session;
    },
  },
};

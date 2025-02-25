import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";


export const authOptions = {
   providers: [
           GoogleProvider({
             clientId: process.env.GOOGLE_CLIENT_ID || "" ,
             clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
           })
         ],
         secret: process.env.NEXTAUTH_SECRET,
         callbacks: {
          async signIn(params: { user: { email: string; }; account: { provider: any; }; }){
            if(!params.user.email){
              return false;
            }
            try {
              const existingUser = await prisma.user.findUnique({
                where: { email: params.user.email },
              });
              if (!existingUser) {
              await prisma.user.create({
                data:{
                  email:params.user.email,
                  role:"User",
                  provider:params.account.provider
                }
              })
            }
            } catch (error) {
              console.log(error);
            }
            return true;
          },
           jwt: async ({ user, token }: any) => {
           if (user) {
               token.id = user.id || user.sub;
           }
           console.log("JWT Token:", token);
           return token;
           },
         session: ({ session, token, user }: any) => {
          console.log("Session Token:", token);
             if (session.user) {
                 session.user.id = token.id
             }
             return session
         }
       } ,
       

}
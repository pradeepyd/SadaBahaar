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
            // console.log(params,"email custom")
            if(!params.user.email){
              return false;
            }
            try {
              const existingUser = await prisma.user.findUnique({
                where: { email: params.user.email },
              });
              // console.log(existingUser,"existing user ");
              if (!existingUser) {
                // console.log("creating user",prisma.user,params.account.provider)
                const providerEnum = params.account.provider === "google" ? "Google" : null;

                if (!providerEnum) {
                  // console.log("Invalid provider:", params.account.provider);
                  return false;
                }
          
                const user = await prisma.user.create({
                  data: {
                    email: params.user.email,
                    role: "User", // Ensure it's a valid enum value
                    provider: providerEnum , // Explicitly cast to Provider enum
                  },
                });
             
              // console.log(user,"useeer");
            }
            } catch (error) {
              // console.log("error")
              console.log("error after",error)
            }
            return true;
          },
           jwt: async ({ user, token }: any) => {
           if (user) {
               token.id = user.id || user.sub;
           }
          //  console.log("JWT Token:", token);
           return token;
           },
         session: ({ session, token, user }: any) => {
          // console.log("Session Token:", token);
             if (session.user) {
                 session.user.id = token.id
             }
             return session
         }
       } ,
       

}
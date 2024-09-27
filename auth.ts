/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";


import Google from "next-auth/providers/google";
import { User } from "@/db/models/userSchema";
import connectDB from "@/db/connectdb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/auth/signin"
  },

  callbacks: {
    async session({session, token}) {
      if(token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({token, user}) {
      if(user) {
        token.id = user.id
      }
      return token
    },

    signIn: async ({ user, account }) => {
      try {
        const { email, name, image } = user;
    
        // Only for OAuth providers (Google in this case)
        if (account?.provider === "google") {
          await connectDB();
          const existingUser = await User.findOne({ email });
    
          if (!existingUser) {
            await User.create({
              email,
              username: name,
              image,
              authProviderId: account.id, 
            });
          }
        }
        return true; // Allow sign-in for both OAuth and credentials
      } catch (error) {
        throw new Error("Error while creating user");
      }
    },
    


  }
});
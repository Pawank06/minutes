/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prismaClient";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      try {
        const { email, name, image } = user;
        // console.log(user);

        // Only for OAuth providers (Google in this case)
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: email as string },
          });

          if (!existingUser) {
            try {
              await prisma.user.create({
                data: {
                  email: email as string,
                  username: name as string,
                  image: image as string,
                  authProviderId: account.id as string,
                },
              });
            } catch (error) {
              console.error(`Error creating user: ${email}`, error);
              return false;
            }
          }
        }
        return true; // Allow sign-in for both OAuth and credentials
      } catch (error: any) {
        throw new Error("Error while creating user", error.message);
      }
    },
  },
  
});

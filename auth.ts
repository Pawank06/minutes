/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prismaClient";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
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
        console.log("SignIn callback started", { user, account });

        const { email, name, image } = user;

        if (!email) {
          throw new Error("Email is required for authentication");
        }

        if (account?.provider === "google") {
          console.log("Google provider detected");

          const existingUser = await prisma.user.findFirst({
            where: { email: email as string },
          });

          console.log("Existing user check", { existingUser });

          if (!existingUser) {
            console.log("Creating new user");
            try {
              const newUser = await prisma.user.create({
                data: {
                  email: email as string,
                  username: name as string,
                  image: image as string,
                  authProviderId: account.id as string,
                },
              });
              console.log("New user created", { newUser });
            } catch (error) {
              console.error("Error creating user", { email, error });
              return false;
            }
          }
        }

        console.log("SignIn callback completed successfully");
        return true;
      } catch (error: any) {
        console.error("SignIn callback error", { error });
        throw new Error("Error during sign in: " + error.message);
      }
    },
  },
});
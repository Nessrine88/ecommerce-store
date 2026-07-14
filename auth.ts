import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";

import { prisma } from "./db/prisma";

export const config: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isMatch = compareSync(
          credentials.password as string,
          user.password
        );

        if (!isMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token, trigger, user }:any) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role!;
        session.user.name = token.name!;
        if (trigger === "update" && user?.name) {
          session.user.name = user.name;
        }
      }

      return session;
    },
    async jwt({token,user, trigger, session}:any){
      if(user){
        token.role = user.role
        if(user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
          await prisma.user.update({
            where: {id: user.id},
            data: {name: token.name}
          })
        }
      }
      return token;
    }
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config);
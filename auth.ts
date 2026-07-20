import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { eq } from "drizzle-orm";

import { db } from "./app/db";
import { users } from "./app/db/schema";


export const config: NextAuthConfig = {

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  adapter: DrizzleAdapter(db),

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


        const result = await db
          .select()
          .from(users)
          .where(
            eq(users.email, credentials.email as string)
          )
          .limit(1);


        const user = result[0];


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

    async session({ session, token, trigger, user }: any) {

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


    async jwt({ token, user }: any) {

      if (user) {

        token.role = user.role;


        if (user.name === "NO_NAME") {

          token.name = user.email!.split("@")[0];


          await db
            .update(users)
            .set({
              name: token.name,
            })
            .where(eq(users.id, user.id));

        }
      }


      return token;
    },
  },

};


export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(config);
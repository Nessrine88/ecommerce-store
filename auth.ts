import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./app/db";
import { users, carts } from "./app/db/schema";

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
          .where(eq(users.email, credentials.email as string))
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

    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
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

      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name;
      }

      if (trigger === "signIn" || trigger === "signUp") {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get("sessionCartId")?.value;

        if (sessionCartId) {
          const sessionCart = await db.query.carts.findFirst({
            where: eq(carts.sessionCartId, sessionCartId),
          });

          if (sessionCart) {
            // Remove any existing cart already tied to this user
            await db.delete(carts).where(eq(carts.userId, user.id));

            // Reassign the guest session cart to the logged-in user
            await db
              .update(carts)
              .set({ userId: user.id })
              .where(eq(carts.id, sessionCart.id));
          }
        }
      }

      return token;
    },

    authorized({ request, auth }: any) {
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prismaClient } from "~/server/prisma";
import { GetSessionParams } from "next-auth/react";
import { PrismaClient, User } from "@prisma/client";
import { randomUUID } from "crypto";

console.log(process.env.GITHUB_ID);
console.log(process.env.GITHUB_SECRET);
export default NextAuth({
  adapter: PrismaAdapter(prismaClient),
  secret: "supersecret",
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const cookie = req!.headers!.cookie as string;
        let sessionToken = /next-auth\.session-token=(.+);?/.exec(cookie) as
          | string[]
          | string;
        sessionToken = sessionToken ? sessionToken[1] : "";

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        let foundUser = await prismaClient.user.findUnique({
          where: {
            email,
          },
        });

        if (!foundUser) {
          foundUser = await prismaClient.user.create({
            data: {
              email: credentials?.email,
              sessions: {
                create: {
                  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                  sessionToken: sessionToken,
                },
              },
              accounts: {
                create: {
                  provider: "Credentials",
                  type: "Credentials",
                  providerAccountId: randomUUID(),
                  refresh_token: "",
                  access_token: "",
                },
              },
            },
          });
        }

        const userInfo = await prismaClient.user.update({
          where: {
            id: foundUser?.id,
          },
          data: {
            sessions: {
              update: {
                where: {
                  userId: foundUser?.id,
                },
                data: {
                  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                  sessionToken: sessionToken,
                },
              },
            },
            accounts: {
              update: {
                where: {
                  userId: foundUser?.id,
                },
                data: {
                  refresh_token: "",
                  access_token: "",
                },
              },
            },
          },
        });

        return userInfo;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      // console.log(session, "session....");
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log(user, "user ...");
      // console.log(account, "account....");

      if (account) {
        token.accessToken = account.access_token;

        if (token.accessToken) {
          console.log(token, "........++");
          await prismaClient.user.update({
            where: {
              id: user?.id,
            },
            data: {
              sessions: {
                connectOrCreate: {
                  where: {
                    userId: user?.id,
                  },
                  create: {
                    sessionToken: token.accessToken as string,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                  },
                },
              },
            },
          });
        }
      }

      return token;
    },
  },
});

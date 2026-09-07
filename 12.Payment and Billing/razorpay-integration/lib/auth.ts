// lib/auth.ts
import { betterAuth } from "better-auth";
import { prisma } from "./db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "./auth-types";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  // ✅ Include the 'plan' field from your User model
  user: {
    additionalFields: {
      plan: {
        type: "string",
        required: false,
        defaultValue: "FREE",
        fieldName: "plan", // matches the column name in the database
      },
    },
  },
});

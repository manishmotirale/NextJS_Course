import { betterAuth } from "better-auth";
import { prisma } from "./db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  plugins: [
    polar({
      client: polarClient,

      createCustomerOnSignUp: true,

      use: [
        checkout({
          products: [
            {
              productId: "36e952c7-4a29-42b6-9a38-e992c674e109",
              slug: "pro",
            },
          ],

          successUrl: "/",
          authenticatedUsersOnly: true,
        }),

        portal(),

        usage(),

        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,

          onOrderCreated: async (order) => {
            console.log(`Order created: ${order.data.id}`);
          },

          onOrderPaid: async (order) => {
            const user = await prisma.user.findFirst({
              where: {
                OR: [
                  {
                    email: order.data.customer.email ?? undefined,
                  },
                  {
                    id: order.data.customer.externalId ?? undefined,
                  },
                ],
              },
            });

            if (!user) {
              throw new Error("User not found");
            }

            await prisma.user.update({
              where: {
                id: user.id,
              },

              data: {
                subscriptionStatus: "active",
                plan: "PRO",
              },
            });

            console.log(`Subscription activated for ${user.email}`);
          },

          onSubscriptionActive: async (subscription) => {
            const user = await prisma.user.findFirst({
              where: {
                id: subscription.data.customer.externalId ?? undefined,
              },
            });

            if (!user) return;

            await prisma.user.update({
              where: {
                id: user.id,
              },

              data: {
                subscriptionStatus: "active",
                plan: "PRO",
              },
            });
          },

          onSubscriptionCanceled: async (subscription) => {
            const user = await prisma.user.findFirst({
              where: {
                id: subscription.data.customer.externalId ?? undefined,
              },
            });

            if (!user) return;

            await prisma.user.update({
              where: {
                id: user.id,
              },

              data: {
                subscriptionStatus: "canceled",
                plan: "FREE",
              },
            });
          },

          onSubscriptionRevoked: async (subscription) => {
            const user = await prisma.user.findFirst({
              where: {
                id: subscription.data.customer.externalId ?? undefined,
              },
            });

            if (!user) return;

            await prisma.user.update({
              where: {
                id: user.id,
              },

              data: {
                subscriptionStatus: "revoked",
                plan: "FREE",
              },
            });
          },
        }),
      ],
    }),
  ],
});

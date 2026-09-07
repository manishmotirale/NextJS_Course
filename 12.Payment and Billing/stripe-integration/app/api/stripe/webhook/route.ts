import { stripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { STRIPE_PRICE_IDs } from "@/lib/stripe";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { useId } from "react";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sign = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      body,
      sign,
      webhookSecret as string,
    );
  } catch (error) {
    console.error("Webook Sigature Verifation Failed", error);
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;

        if (!userId || !priceId || !session.subscription) break;

        const subscription = await stripeClient.subscriptions.retrieve(
          session.subscription as string,
        );

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.items.data[0].current_period_end * 1000,
            ),

            plan: priceId === "premium" ? "PREMIUM" : "FREE",
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: {
            stripeCustomerId: customerId,
          },
        });

        if (!user) break;

        // frive plan from STRIP(not DB)
        const priceId = subscription.items.data[0].price.id;
        const isActive = subscription.status === "active";

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.items.data[0].current_period_end * 1000,
            ),
            plan: isActive && priceId === "premium" ? "PREMIUM" : "FREE",
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data
          .object as Stripe.Subscription as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: {
            stripeCustomerId: customerId,
          },
        });

        if (!user) break;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            plan: "FREE",
          },
        });

        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json(
      { error: "Webhook Handler Failed" },
      { status: 500 },
    );
  }
}

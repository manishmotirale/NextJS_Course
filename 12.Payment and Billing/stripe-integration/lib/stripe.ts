import stripe from "stripe";

export const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

export const STRIPE_PRICE_IDs = {
  premium: "price_1Ta9PnApLq7z37clwDhvO69I",
} as const;

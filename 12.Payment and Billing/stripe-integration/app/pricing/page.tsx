import PricingCards from "@/components/pricing-cards";
import { requireAuth } from "@/lib/auth-guard";
import React from "react";

const pricingTiers = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    currency: "INR",
    interval: "month",
    features: [
      "Access to basic features",
      "Limited usage",
      "Community support",
    ],
    isPopular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 10,
    priceId: "premium",
    currency: "INR",
    interval: "month",
    features: [
      "All Free features",
      "Unlimited usage",
      "Priority support",
      "Access to premium content",
    ],
    isPopular: true,
  },
];

const PricingPage = async () => {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Sample Pricing
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          Choose a Plan that Fits your Needs
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-6xl">
        <PricingCards tiers={pricingTiers} />
      </div>
    </div>
  );
};

export default PricingPage;
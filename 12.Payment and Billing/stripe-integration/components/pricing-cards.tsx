"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PricingTier = {
  id: string;
  name: string;
  price: number;
  priceId: string | null;
  currency: string;
  interval: string;
  features: string[];
  isPopular?: boolean;
};

const PricingCards = ({ tiers }: { tiers: PricingTier[] }) => {
  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      alert("This plan is free. No subscription needed!");
      return;
    }

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url; //redirect to stripe checkout page
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
      {tiers.map((tier) => (
        <Card
          key={tier.id}
          className={`relative overflow-hidden rounded-3xl border bg-slate-900/80 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
            tier.isPopular
              ? "border-indigo-500 shadow-indigo-500/20"
              : "border-slate-800"
          }`}
        >
          {/* Popular Badge */}
          {tier.isPopular && (
            <div className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Most Popular
            </div>
          )}

          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-white">
              {tier.name}
            </CardTitle>

            <div className="mt-5 flex items-end gap-1">
              <span className="text-5xl font-extrabold text-white">
                ₹{tier.price}
              </span>

              <span className="mb-1 text-sm text-slate-400">
                /{tier.interval}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-between">
            {/* Features */}
            <ul className="space-y-4">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-xs text-indigo-400">
                    ✓
                  </div>

                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <Button
              className={`mt-8 h-12 rounded-xl text-sm font-semibold transition-all duration-300 ${
                tier.isPopular
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
              variant="default"
              onClick={() => handleSubscribe(tier.priceId)}
            >
              {tier.price === 0 ? "Get Started" : "Upgrade Now"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;

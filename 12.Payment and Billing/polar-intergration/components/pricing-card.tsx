"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

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
    const result = await authClient.checkout({
      slug: "pro",
    });

    console.log(result);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
      {tiers.map((tier) => (
        <Card
          key={tier.id}
          className={`relative flex flex-col justify-between border ${
            tier.isPopular
              ? "border-primary shadow-lg scale-[1.02]"
              : "border-muted"
          }`}
        >
          {tier.isPopular && (
            <span className="absolute top-3 right-3 text-xs bg-primary text-white px-2 py-1 rounded-md">
              Popular
            </span>
          )}

          <CardHeader>
            <CardTitle className="text-2xl">{tier.name}</CardTitle>
            <div className="mt-2">
              <span className="text-4xl font-bold">${tier.price}</span>
              <span className="text-muted-foreground text-sm">
                /{tier.interval}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full mt-4"
              variant={tier.isPopular ? "default" : "outline"}
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

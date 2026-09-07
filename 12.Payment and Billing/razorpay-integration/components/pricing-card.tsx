"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PricingCards = ({ tiers }: { tiers: PricingTier[] }) => {
  const { data } = authClient.useSession();

  const handleSubscribe = async (priceId: string | null, amount: number) => {
    // amount should be in paise (e.g., 10 USD -> 1000)
    const orderResponse = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const { orderId } = await orderResponse.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: orderId,
      amount: amount,
      currency: "INR",
      name: "Pro Upgrade",
      description: "Upgrade to Pro Plan",
      prefill: {
        name: data?.user?.name,
        email: data?.user?.email,
      },
      theme: { color: "#2563eb" },
      handler: async function (response: any) {
        const verifyResponse = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const result = await verifyResponse.json();

        if (result.success) {
          toast.success("Payment Successful! Redirecting...");
          window.location.href = "/"; // ✅ redirect to home
        } else {
          toast.error(result.message);
        }
      },
      modal: {
        ondismiss: () => toast.info("Payment cancelled"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
              onClick={() => handleSubscribe(tier.priceId, tier.price * 100)}
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

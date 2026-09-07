import PricingCards from "@/components/pricing-card";
import { requireAuth } from "@/lib/auth-guard";

const pricingTiers = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    currency: "USD",
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
    currency: "USD",
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
    <div className="min-h-screen py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-normal">Sample Pricing</h1>
        <p className="text-muted-foreground mt-2">
          Choose a plan that fits your needs
        </p>
      </div>

      <PricingCards tiers={pricingTiers} />
    </div>
  );
};

export default PricingPage;

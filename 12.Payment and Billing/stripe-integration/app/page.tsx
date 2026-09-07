import Image from "next/image";
import Link from "next/link";

import { requireAuth } from "@/lib/auth-guard";
import LogoutButton from "@/components/logout-button";
import { prisma } from "@/lib/db";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

async function Home() {
  const session = await requireAuth();
  const { user } = session;

  const dbuser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      plan: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  const isPremium = dbuser?.plan === "PREMIUM";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-2 text-muted-foreground">
            Manage your account and subscription settings.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

          <CardContent className="-mt-12 p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <Image
                  src={user.image ?? "/avatar.png"}
                  alt={user.name ?? "User"}
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-background shadow-lg"
                />

                <div>
                  <h2 className="text-2xl font-semibold">{user.name}</h2>

                  <p className="text-muted-foreground">{user.email}</p>

                  <Badge
                    className="mt-3"
                    variant={isPremium ? "default" : "secondary"}
                  >
                    {isPremium ? "✨ Premium Member" : "Free Plan"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                {!isPremium ? (
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      size: "lg",
                    })}
                  >
                    Upgrade Plan
                  </Link>
                ) : (
                  <Button size="lg" variant="outline">
                    Manage Subscription
                  </Button>
                )}

                <LogoutButton />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Current subscription details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>

                <p className="text-lg font-semibold">
                  {isPremium ? "Premium" : "Free"}
                </p>
              </div>

              {isPremium && dbuser?.stripeCurrentPeriodEnd && (
                <div>
                  <p className="text-sm text-muted-foreground">Active Until</p>

                  <p className="font-medium">
                    {new Date(
                      dbuser.stripeCurrentPeriodEnd,
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>

                <p className="font-medium">{user.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>

                <p className="font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">User ID</p>

                <p className="truncate font-mono text-sm">{user.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common account management actions</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-3">
              {!isPremium && (
                <Link href="/pricing" className={buttonVariants()}>
                  Upgrade to Premium
                </Link>
              )}

              <Button variant="outline">Update Profile</Button>

              <Button variant="outline">Billing History</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;

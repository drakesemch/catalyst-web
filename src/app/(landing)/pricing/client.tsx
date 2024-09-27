"use client";

import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import ShineBorder from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";

const plans = [
  {
    name: "Free",
    features: [
      {
        name: "Canvas Client",
      },
      {
        name: "Dark Mode",
      },
      {
        name: "Ad-free Experience",
      },
      {
        name: "Schedules",
      },
      {
        name: "Friends and Groups",
      },
      {
        name: "Enhanced Notifications",
      },
    ],
  },
  {
    name: "Pro",
    features: [
      {
        name: "Paper Proof-reading",
      },
      {
        name: "Advanced Study Tools",
      },
      {
        name: "Assignment and Daily Summaries",
      },
      {
        name: "Grade History",
      },
      {
        name: "Pre-Released Features",
      },
      // {
      //   name: "Scheduled Messages",
      // },
      // {
      //   name: "Scheduled Submissions",
      // },
      {
        name: "Priority Support",
      },
    ],
  },
];

export function PricingClient() {
  const [prices] = api.catalyst.pricing.pro.useSuspenseQuery();
  return (
    <>
      <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
        <div className="flex w-[min(80ch,100%)] flex-col gap-2">
          <div className="mx-auto max-w-3xl text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Pricing
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Simple Pricing for Everyone
              </h2>
              <p className="text-md text-muted-foreground">
                We believe that quality education tools should be accessible to
                everyone. That{"'"}s why we are committed to offering reasonable
                pricing for our premium features, ensuring that Catalyst remains
                affordable.
              </p>
              <div />
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-8">
            {plans.map((plan, idx) =>
              idx == 0 ? (
                <Plan
                  key={plan.name}
                  plan={plan}
                  idx={idx}
                  yrPrice={0}
                  href="/auth"
                />
              ) : (
                <ShineBorder
                  key={plan.name}
                  borderWidth={2}
                  className="[&_[data-shine-border]::before]:inset-2"
                >
                  <Plan
                    plan={plan}
                    idx={idx}
                    yrPrice={
                      Number(
                        prices.data.find(
                          (price) => price.recurring?.interval == "year",
                        )?.unit_amount ?? 0,
                      ) / 100
                    }
                    href="/app/upgrade"
                  />
                </ShineBorder>
              ),
            )}
          </div>
        </div>
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}

function Plan({
  yrPrice,
  plan,
  idx,
  href,
}: {
  yrPrice: number;
  plan: (typeof plans)[0];
  idx: number;
  href?: string;
}) {
  return (
    <div
      className={cn(
        "h-full w-full rounded-lg border p-6 shadow-lg md:p-8",
        idx == 0
          ? "bg-background"
          : "bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground",
      )}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-4xl font-bold">
              ${yrPrice.toFixed(2).split(".")[0]}
              <sup className="text-xl">
                <span className="sr-only">.</span>
                {yrPrice.toFixed(2).split(".")[1]}
              </sup>
            </span>
            <span className="opacity-50">/yr</span>
          </div>
          <div className="flex items-baseline justify-center space-x-2 text-xs">
            <span>
              ${(yrPrice / 12).toFixed(2).split(".")[0]}
              <sup className="text-[0.5rem]">
                <span className="sr-only">.</span>
                {(yrPrice / 12).toFixed(2).split(".")[1]}
              </sup>
            </span>
            <span className="opacity-50">/mo</span>
          </div>
        </div>
        <Button
          variant={idx == 0 ? "outline" : "secondary"}
          className={cn(
            "w-full",
            idx != 0 && "dark:bg-primary dark:text-primary-foreground",
          )}
          href={href}
        >
          Continue with an account <ArrowRight />
        </Button>
      </div>
      <Separator className="my-6 bg-current opacity-30" />
      <div className="flex flex-col space-y-4">
        {idx != 0 && (
          <div className="flex items-center gap-2">
            <ArrowLeft />
            Everything in {plans[idx - 1]!.name}
          </div>
        )}
        {plan.features.map((feature) => (
          <div key={feature.name} className="flex items-center gap-2">
            <Check />
            <span>{feature.name}</span>
          </div>
        ))}
        {idx != 0 && (
          <div className="flex items-center gap-2">
            <Plus />
            And More
          </div>
        )}
      </div>
    </div>
  );
}

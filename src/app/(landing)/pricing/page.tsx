"use client";

import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import ShineBorder from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { useState } from "react";

const PRO_BASE_PRICE = 6;

const plans = [
  {
    name: "Free",
    price: {
      month: Number(0).toFixed(2),
      quarter: Number(0).toFixed(2),
      semester: Number(0).toFixed(2),
      year: Number(0).toFixed(2),
    },
    features: [
      {
        name: "Canvas Client",
      },
      {
        name: "Dark Mode",
      },
      {
        name: "Schedules",
      },
      {
        name: "Messaging",
      },
      {
        name: "Enhanced Notifications",
      },
      {
        name: "E-Mail Integration",
      },
    ],
  },
  {
    name: "Pro",
    price: {
      month: Math.ceil(Number(Number(PRO_BASE_PRICE).toFixed(2))).toFixed(2),
      quarter: Math.ceil(
        Number(Number(PRO_BASE_PRICE * 3 * 0.9).toFixed(2)),
      ).toFixed(2),
      semester: Math.ceil(
        Number(Number(PRO_BASE_PRICE * 6 * 0.8).toFixed(2)),
      ).toFixed(2),
      year: Math.ceil(
        Number(Number(PRO_BASE_PRICE * 12 * 0.6).toFixed(2)),
      ).toFixed(2),
    },
    features: [
      {
        name: "Advanced AI Features",
      },
      {
        name: "Pre-Released Features",
      },
      {
        name: "Games",
      },
      {
        name: "Advanced Tooling",
      },
      {
        name: "Scheduled Messages",
      },
      {
        name: "Scheduled Submissions",
      },
      {
        name: "Priority Support",
      },
    ],
  },
];

function convertToMonth(
  price: string,
  period: keyof (typeof plans)[0]["price"],
) {
  switch (period) {
    case "month":
      return price;
    case "quarter":
      return (Number(price) / 3).toFixed(2);
    case "semester":
      return (Number(price) / 6).toFixed(2);
    case "year":
      return (Number(price) / 12).toFixed(2);
  }
}

export default function TimelinePage() {
  const [period, setPeriod] =
    useState<keyof (typeof plans)[0]["price"]>("year");

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
              <Tabs
                defaultValue={period}
                onValueChange={(period) =>
                  setPeriod(period as keyof (typeof plans)[0]["price"])
                }
              >
                <TabsList className="flex-wrap">
                  <TabsTrigger value="month">Monthly</TabsTrigger>
                  <TabsTrigger value="quarter">Quarterly</TabsTrigger>
                  <TabsTrigger value="semester">Semesterly</TabsTrigger>
                  <TabsTrigger value="year">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-8">
            {plans.map((plan, idx) =>
              idx == 0 ? (
                <Plan key={plan.name} plan={plan} period={period} idx={idx} />
              ) : (
                <ShineBorder
                  key={plan.name}
                  borderWidth={2}
                  className="[&_[data-shine-border]::before]:inset-2"
                >
                  <Plan plan={plan} period={period} idx={idx} />
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
  plan,
  period,
  idx,
}: {
  plan: (typeof plans)[0];
  period: keyof (typeof plans)[0]["price"];
  idx: number;
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
              ${plan.price[period].split(".")[0]}
              <sup className="text-xl">
                <span className="sr-only">.</span>
                {plan.price[period].split(".")[1]}
              </sup>
            </span>
            <span className="opacity-50">/{period}</span>
          </div>
          <div className="flex items-baseline justify-center space-x-2 text-xs">
            <span>
              ${convertToMonth(plan.price[period], period).split(".")[0]}
              <sup className="text-[0.5rem]">
                <span className="sr-only">.</span>
                {convertToMonth(plan.price[period], period).split(".")[1]}
              </sup>
            </span>
            <span className="opacity-50">/month</span>
          </div>
        </div>
        <Button
          variant={idx == 0 ? "outline" : "secondary"}
          className={cn(
            "w-full",
            idx != 0 && "dark:bg-primary dark:text-primary-foreground",
          )}
        >
          Get Started
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

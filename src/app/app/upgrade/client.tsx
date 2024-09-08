"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";
import { ArrowRight, Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function TermSelectAndCheckout() {
  const [prices] = api.catalyst.pricing.pro.useSuspenseQuery();
  const {
    mutate: createCheckoutLink,
    isSuccess,
    isPending,
    data: checkoutInfo,
  } = api.catalyst.pricing.pay.useMutation();
  const [selectedTerm, setSelectedTerm] = useState("12");

  useEffect(() => {
    if (checkoutInfo == undefined) return;
    redirect(checkoutInfo.url ?? "");
  }, [checkoutInfo]);

  return (
    <>
      <RadioGroup
        value={selectedTerm}
        onValueChange={setSelectedTerm}
        className="flex w-full flex-col justify-stretch gap-4"
      >
        {prices.data
          .sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0))
          .map((price) => {
            const months =
              (price.recurring?.interval_count ?? 0) *
              (price.recurring?.interval == "year" ? 12 : 1);
            const longTermAbbr = (() => {
              if (price.recurring?.interval == "year") {
                return "Year";
              } else if (price.recurring?.interval == "month") {
                if (price.recurring?.interval_count == 1) {
                  return "Month";
                } else if (price.recurring?.interval_count == 3) {
                  return "Quarter";
                } else if (price.recurring?.interval_count == 6) {
                  return "Semester";
                }
              }
            })();
            const termAbbr = (() => {
              if (price.recurring?.interval == "year") {
                return "yr";
              } else if (price.recurring?.interval == "month") {
                if (price.recurring?.interval_count == 1) {
                  return "mo";
                } else if (price.recurring?.interval_count == 3) {
                  return "qtr";
                } else if (price.recurring?.interval_count == 6) {
                  return "6mo";
                }
              }
            })();

            return (
              <div key={months}>
                <Label className="flex w-full items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <div className="flex flex-row items-center gap-2">
                    <RadioGroupItem
                      value={String(months)}
                      id={String(months)}
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold">{longTermAbbr}</span>
                      <span className="text-xs text-muted-foreground">
                        Billed {longTermAbbr?.toLowerCase()}ly
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-end space-x-2">
                      <span className="text-4xl font-bold">
                        $
                        {
                          ((price.unit_amount ?? 0) / 100)
                            .toFixed(2)
                            .split(".")[0]
                        }
                        <sup className="text-xl">
                          <span className="sr-only">.</span>
                          {
                            ((price.unit_amount ?? 0) / 100)
                              .toFixed(2)
                              .split(".")[1]
                          }
                        </sup>
                      </span>
                      <span className="opacity-50">/{termAbbr}</span>
                    </div>
                    <div className="flex items-baseline justify-end space-x-3 text-xs">
                      <span>
                        $
                        {
                          ((price.unit_amount ?? 0) / 100 / months)
                            .toFixed(2)
                            .split(".")[0]
                        }
                        <sup className="text-[0.5rem]">
                          <span className="sr-only">.</span>
                          {
                            ((price.unit_amount ?? 0) / 100 / months)
                              .toFixed(2)
                              .split(".")[1]
                          }
                        </sup>
                      </span>
                      <span className="opacity-50">/mo</span>
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
      </RadioGroup>
      <div className="mt-4 flex items-center justify-end">
        <Button
          onClick={() =>
            createCheckoutLink({
              priceId:
                prices.data.find(
                  (price) =>
                    (price.recurring?.interval_count ?? "0") == selectedTerm ||
                    (selectedTerm == "12" &&
                      price.recurring?.interval == "year"),
                )?.id ?? "",
            })
          }
          disabled={isPending || isSuccess}
        >
          {(() => {
            if (isSuccess) {
              return (
                <>
                  Redirecting <Loader className="animate-spin" />
                </>
              );
            } else if (isPending) {
              return (
                <>
                  Creating Checkout Link <Loader className="animate-spin" />
                </>
              );
            } else {
              return (
                <>
                  Checkout <ArrowRight />
                </>
              );
            }
          })()}
        </Button>
      </div>
    </>
  );
}

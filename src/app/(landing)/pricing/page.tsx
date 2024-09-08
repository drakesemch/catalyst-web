import { api } from "@/trpc/server";
import { PricingClient } from "./client";

export default async function PricingPage() {
  await api.catalyst.pricing.pro.prefetch();
  return <PricingClient />;
}

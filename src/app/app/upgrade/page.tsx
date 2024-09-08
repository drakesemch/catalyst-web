import { api } from "@/trpc/server";
import { TermSelectAndCheckout } from "./client";
import { redirect } from "next/navigation";

export default async function UpgradePage() {
  const isPro = await api.catalyst.user.isPro();

  if (isPro) {
    redirect("/app/upgrade/confirm");
  }

  await api.catalyst.pricing.pro.prefetch();

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 lg:flex-row">
      <main className="flex max-w-[100ch] flex-1 flex-col items-center gap-2 px-4 py-16">
        <h1 className="h1 flex flex-wrap gap-3 py-4">
          <span className="animate-fade-in opacity-0 animate-delay-400">
            Let{"'"}s
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-600">
            get
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-800">
            you
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-1200">
            upgraded!
          </span>
        </h1>
        <div className="w-full animate-fade-in opacity-0 animate-delay-1500">
          <TermSelectAndCheckout />
        </div>
      </main>
    </div>
  );
}

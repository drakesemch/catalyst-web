import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await api.catalyst.user.authState())) redirect("/auth");

  void api.catalyst.user.get.prefetch();
  void api.catalyst.user.settings.get.prefetch();

  return <Suspense fallback={<></>}>{children}</Suspense>;
}

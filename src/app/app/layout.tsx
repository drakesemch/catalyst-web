import { AppCmdK } from "@/components/catalyst/app/cmd-k";
import { AppNav } from "@/components/catalyst/app/navs";
import { hasFinishedOnboarding } from "@/lib/onboarding";

import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await api.catalyst.user.authState())) redirect("/auth");
  if (!(await hasFinishedOnboarding())) redirect("/onboarding");

  return (
    <>
      <AppNav />
      <AppCmdK />
      {children}
    </>
  );
}

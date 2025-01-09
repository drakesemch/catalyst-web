import { AppCmdK } from "@/components/catalyst/app/cmd-k";
import { AppNav } from "@/components/catalyst/app/navs";
import { hasFinishedOnboarding } from "@/lib/onboarding";
import { HydrateClient, api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { CanvasWarningPopup, ReportButton } from "./clientLayout";
import { RealtimeProvider } from "@/components/catalyst/app/realtime-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await api.catalyst.user.authState())) redirect("/auth");
  if (!(await hasFinishedOnboarding())) redirect("/onboarding");

  await api.catalyst.user.canvas.courses.list.prefetch();

  const needsAttention = await api.catalyst.user.canvas.needsAttention();

  return (
    <HydrateClient>
      <RealtimeProvider>
        <AppNav />
        <AppCmdK />
        {children}
        <div className="mt-20 w-full md:mt-0" />
        {needsAttention && <CanvasWarningPopup />}
        <ReportButton />
      </RealtimeProvider>
    </HydrateClient>
  );
}

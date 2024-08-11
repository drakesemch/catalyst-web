import { LandingNav } from "@/components/catalyst/landing/navs";
import { LandingCmdK } from "@/components/catalyst/landing/cmd-k";
import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await api.catalyst.auth.state();
  void api.catalyst.auth.state.prefetch();

  return (
    <>
      <LandingNav />
      <LandingCmdK />
      {children}
    </>
  );
}

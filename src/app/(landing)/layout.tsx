import { LandingNav } from "@/components/catalyst/landing/landing-navs";
import { LandingCmdK } from "@/components/catalyst/landing/landing-cmd-k";
import { api } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void api.catalyst.auth.state.prefetch();

  return (
    <>
      <LandingNav />
      <LandingCmdK />
      {children}
    </>
  );
}

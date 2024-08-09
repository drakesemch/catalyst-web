import { LandingNav } from "@/components/catalyst/landing/landing-navs";
import { LandingCmdK } from "@/components/catalyst/landing/landing-cmd-k";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      <LandingCmdK />
      {children}
    </>
  );
}

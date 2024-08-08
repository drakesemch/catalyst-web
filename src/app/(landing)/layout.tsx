import { LandingNav } from "@/components/catalyst/landing-navs";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      {children}
    </>
  );
}

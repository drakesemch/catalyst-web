import { LandingFooter } from "@/components/catalyst/landing/landing-navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Flag,
  HelpCircle,
  Power,
  Search,
  Users,
} from "lucide-react";

export default function AuthPage() {
  return (
    <>
      <main className="relative flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-16">
        <div className="flex w-[min(80ch,100%)] flex-col items-center gap-6">
          Auth page
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 text-center backdrop-blur-md">
          <h2 className="text-2xl font-bold">
            This section is under construction
          </h2>
          <p className="mt-4 text-gray-500">
            We{"'"}re working hard to bring you the best possible experience.
            Please check back soon!
          </p>
        </div>
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}

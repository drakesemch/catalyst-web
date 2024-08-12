import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Flag,
  HelpCircle,
  Power,
  Search,
  Users,
} from "lucide-react";

export default function HelpPage() {
  return (
    <>
      <main className="relative flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
        <div className="flex w-[min(80ch,100%)] flex-col items-center gap-6">
          <h1 className="h1 flex items-center gap-4">
            <HelpCircle className="text-5xl" /> Help Center
          </h1>
          <div />
          <label className="flex w-full items-center gap-2 rounded-md border pl-6 text-lg">
            <Search />
            <Input
              placeholder="Search questions and forums"
              className="h-auto border-0 px-6 py-4 text-lg"
            />
          </label>
          <div />
          <h2 className="h3 w-full text-left">Resources</h2>
          <div className="grid w-[min(80ch,100%)] grid-cols-2 gap-4 overflow-auto">
            <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
              <h3 className="h4 flex items-center gap-4">
                <Flag /> Getting Started
              </h3>
              <Separator className="-mx-8 w-auto" />
              <ul className="flex flex-col gap-2 pl-4">
                <li className="text-muted-foreground">
                  How to create an account
                </li>
                <li className="text-muted-foreground">
                  How to create a new project
                </li>
                <li className="text-muted-foreground">
                  How to invite collaborators
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
              <h3 className="h4 flex items-center gap-4">
                <Power /> Troubleshooting
              </h3>
              <Separator className="-mx-8 w-auto" />
              <ul className="flex flex-col gap-2 pl-4">
                <li className="text-muted-foreground">
                  How to fix common issues
                </li>
                <li className="text-muted-foreground">How to report a bug</li>
                <li className="text-muted-foreground">
                  How to contact support
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
              <h3 className="h4 flex items-center gap-4">
                <DollarSign /> Billing
              </h3>
              <Separator className="-mx-8 w-auto" />
              <ul className="flex flex-col gap-2 pl-4">
                <li className="text-muted-foreground">
                  How to change your plan
                </li>
                <li className="text-muted-foreground">
                  How to update your payment method
                </li>
                <li className="text-muted-foreground">
                  How to cancel your subscription
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
              <h3 className="h4 flex items-center gap-4">
                <Users /> Community
              </h3>
              <Separator className="-mx-8 w-auto" />
              <ul className="flex flex-col gap-2 pl-4">
                <li className="text-muted-foreground">
                  How to join the community
                </li>
                <li className="text-muted-foreground">How to contribute</li>
                <li className="text-muted-foreground">How to share feedback</li>
              </ul>
            </div>
          </div>
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

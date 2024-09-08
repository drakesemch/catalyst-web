import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { ClientConfirmation } from "./client";

export default async function ConfirmPage() {
  const isPro = await api.catalyst.user.isPro();
  if (!isPro) {
    return (
      <main className="relative flex min-h-[calc((100vh-4.5rem-1px)+2rem)] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg p-20">
        <h1 className="h1">
          <span className="font-bold">402</span>
          <span className="text-muted-foreground"> - Payment Required</span>
        </h1>
        <p className="p max-w-[60ch] text-sm text-muted-foreground">
          If you came across this page out of the wild, great job! If you came
          from stripe checkout and had a successful payment, it might take a few
          seconds to update your account. If you have any issues, we are sorry
          for the inconvenience. Please contact us at{" "}
          <Button variant="link" href="/help" className="h-auto px-0">
            our help page
          </Button>
          .
        </p>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
      </main>
    );
  }
  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 lg:flex-row">
      <main className="flex max-w-[100ch] flex-1 flex-col items-center gap-2 px-4 py-16">
        <h1 className="h1 flex flex-wrap gap-3 py-4">
          <span className="animate-fade-in opacity-0 animate-delay-400">
            Congrats!
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-600">
            You
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-800">
            have
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-1200">
            been
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-1400">
            upgraded
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-1600">
            to
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-1700">
            pro!
          </span>
        </h1>
        <div className="w-1/2 animate-fade-in opacity-0 animate-delay-2000">
          <ClientConfirmation />
        </div>
      </main>
    </div>
  );
}

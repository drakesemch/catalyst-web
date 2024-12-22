import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function AuthErrorPage() {
    return (
        <>
            <main className="relative isolate flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center overflow-hidden p-16">
                <div className="flex w-[min(80ch,100%)] flex-1 flex-col items-center justify-center gap-6">
                    <h1 className="h1">Something went wrong</h1>
                    <p className="text-center text-lg text-muted-foreground">
                        Please try again
                    </p>
                    <Button
                        href="/auth"
                        variant="secondary"
                    >
                        <ArrowRight /> Continue back to sign-in
                    </Button>
                </div>
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatdelay={1}
                    className={cn(
                        "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                        "pointer-events-none inset-x-0 inset-y-[-30%] -z-10 h-[200%] skew-y-12",
                    )}
                />
            </main>
            <SquigglySeparator waveColor="hsl(var(--muted))" className="-mt-3" />
            <LandingFooter />
        </>
    );
}
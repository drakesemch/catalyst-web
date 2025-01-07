"use client";

import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  return (
    <>
      <main className="relative isolate flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center overflow-hidden p-16">
        <div className="flex w-[min(80ch,100%)] flex-1 flex-col items-center justify-center gap-6">
          <h1 className="h1">Welcome to Catalyst</h1>
          <p className="text-center text-lg text-muted-foreground">
            Please continue using a social provider
          </p>
          <Button
            type="submit"
            onClick={async () =>
              await signIn("google", {
                callbackUrl: `${window.location.origin}/app`,
              })
            }
          >
            <GoogleLogo /> Continue with Google
          </Button>
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to Catalyst{"'"}s{" "}
            <Button
              href="/policies/terms"
              target="_blank"
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
            >
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button
              href="/policies/privacy"
              target="_blank"
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
            >
              Privacy Policy
            </Button>
            .
          </p>
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

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31.27"
      height="32"
      viewBox="0 0 256 262"
      className={cn("size-[1em]", className)}
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
      />
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}

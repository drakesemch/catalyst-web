"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { SquareArrowOutUpRight, UserRound } from "lucide-react";

export function OpenApp({ className }: { className?: string }) {
  const [isLoggedIn] =
    typeof window == "undefined"
      ? [false]
      : api.catalyst.auth.state.useSuspenseQuery();

  return (
    <>
      {isLoggedIn ? (
        <Button href="/app" className={className}>
          <SquareArrowOutUpRight />
          Open App
        </Button>
      ) : (
        <Button href="/auth" className={className}>
          <UserRound />
          Sign In
        </Button>
      )}
    </>
  );
}

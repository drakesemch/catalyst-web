"use client";

import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

export function ClientConfirmation() {
  useEffect(() => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = async () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })?.catch(console.error);
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })?.catch(console.error);

      requestAnimationFrame(() => {
        frame().catch(console.error);
      });
    };

    frame().catch(console.error);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <Button
        variant="outline"
        href="/app/"
        className="h-auto px-8 py-4 text-xl"
      >
        Home <ArrowRight />
      </Button>
    </div>
  );
}

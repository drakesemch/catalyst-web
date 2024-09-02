import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <>
      <main className="relative flex min-h-[calc(100vh-4.5rem-1px)] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg p-20">
        <h1 className="h1">
          <span className="font-bold">404</span>
          <span className="text-muted-foreground"> - Discussion Not Found</span>
        </h1>
        <p className="p max-w-[60ch] text-sm text-muted-foreground">
          The page you are looking for does not exist. Please check the URL in
          the address bar and try again or return to the{" "}
          <Button variant="link" href="/home" className="h-auto px-0">
            homepage
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
    </>
  );
}

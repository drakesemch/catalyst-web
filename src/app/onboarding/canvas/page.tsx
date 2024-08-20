"use client";

import { Input } from "@/components/ui/input";
import styles from "./page.module.css";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Book,
  Calendar,
  Clapperboard,
  Clock,
  Gauge,
  HelpCircle,
  Loader,
  Lock,
  MoreVertical,
  MousePointer,
  Newspaper,
  Plus,
  RotateCw,
  SquareArrowOutUpRight,
  UserRound,
} from "lucide-react";
import { api } from "@/trpc/react";

export default function CanvasOnboardingPage() {
  const [settings] = api.catalyst.user.settings.get.useSuspenseQuery();
  const [school] = api.catalyst.school.get.draft.details.useSuspenseQuery({
    id: settings?.find((s) => s.key == "school_id")?.value ?? "",
  });
  const { mutate, isPending } = api.catalyst.user.settings.draft.useMutation();

  return (
    <main className="relative flex min-h-[100vh] w-full flex-col items-center justify-start gap-2 overflow-hidden">
      <div className="flex w-[min(100vw,100ch)] flex-col items-start justify-start gap-4 p-12">
        <div
          className="flex w-full animate-fade-in flex-col items-center justify-center gap-2 opacity-0 md:flex-row md:justify-between"
          style={{ animationDelay: "3000ms" }}
        >
          <div className="flex flex-row items-center gap-2">
            <Button href="/onboarding" variant="outline" size="sm">
              <ArrowLeft /> Back to Step 1
            </Button>
          </div>
          <div className="flex flex-row items-center gap-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {!isPending ? (
                <>Step 2 of 3</>
              ) : (
                <>
                  <Loader className="animate-spin" /> Saving as Draft
                </>
              )}
            </div>
            <Button size="sm" href="/onboarding/schedule">
              Continue <ArrowRight />
            </Button>
          </div>
        </div>
        <h1 className="flex flex-wrap gap-3 text-balance text-5xl font-bold md:text-6xl">
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            Let{"'"}s
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "500ms" }}
          >
            get
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "700ms" }}
          >
            connected
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "1200ms" }}
          >
            to
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "1400ms" }}
          >
            Canvas!
          </span>
        </h1>
        <div className="grid h-12 place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
          <p
            className="flex w-full max-w-full animate-fade-out flex-wrap justify-start gap-2 text-3xl font-bold text-muted-foreground md:text-4xl"
            style={{ animationDelay: "4000ms" }}
          >
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "1800ms" }}
            >
              Navigate
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "2200ms" }}
            >
              to
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "2500ms" }}
            >
              Canvas
            </span>
          </p>
          <p
            className="flex w-full max-w-full animate-fade-out flex-wrap justify-start gap-2 text-3xl font-bold text-muted-foreground md:text-4xl"
            style={{ animationDelay: "9000ms" }}
          >
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "5000ms" }}
            >
              Visit
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "5400ms" }}
            >
              Settings
            </span>
          </p>
          <p
            className="flex w-full max-w-full animate-fade-out flex-wrap justify-start gap-2 text-3xl font-bold text-muted-foreground md:text-4xl"
            style={{ animationDelay: "16000ms" }}
          >
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "10000ms" }}
            >
              Generate
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "10400ms" }}
            >
              access
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "10800ms" }}
            >
              token
            </span>
          </p>
          <p
            className="flex w-full max-w-full animate-fade-out flex-wrap justify-start gap-2 text-3xl font-bold text-muted-foreground md:text-4xl"
            style={{ animationDelay: "20000ms" }}
          >
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "18000ms" }}
            >
              Copy
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "18300ms" }}
            >
              token
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "18400ms" }}
            >
              and
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "18700ms" }}
            >
              paste
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "19000ms" }}
            >
              here!
            </span>
          </p>
          <p className="flex w-full max-w-full flex-wrap justify-start gap-2 text-3xl font-bold text-muted-foreground md:text-4xl">
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "20200ms" }}
            >
              Token:
            </span>
            <span
              className="flex-1 animate-fade-in opacity-0"
              style={{ animationDelay: "20400ms" }}
            >
              <Input
                placeholder="Paste your access token here..."
                onChange={(val) => {
                  mutate({
                    canvasToken: val.target.value,
                  });
                }}
              />
            </span>
          </p>
        </div>
        <div
          className="relative flex aspect-video w-full animate-fade-in flex-col rounded-lg border opacity-0"
          style={{ animationDelay: "3400ms" }}
        >
          <div className="flex items-center gap-2 border-b p-4">
            <div className="size-4 rounded-full bg-red-500" />
            <div className="size-4 rounded-full bg-amber-500" />
            <div className="size-4 rounded-full bg-green-500" />
            <div />
            <div className="rounded-md border p-2 opacity-50">
              <ArrowLeft />
            </div>
            <div className="rounded-md border p-2 opacity-50">
              <ArrowRight />
            </div>
            <div className="rounded-md border p-2 opacity-50">
              <RotateCw />
            </div>
            <Button
              variant="outline"
              href={school?.canvasURL ?? "https://canvas.instructure.com/"}
              target="_blank"
              className="flex h-auto flex-1 items-center justify-start gap-2 px-3 py-1.5"
            >
              <Lock />
              {school?.canvasURL ?? "https://canvas.instructure.com/"}
              <div className="ml-auto" />
              <Separator orientation="vertical" className="h-4" />
              <SquareArrowOutUpRight />
            </Button>
            <div className="rounded-md border p-2 opacity-50">
              <MoreVertical />
            </div>
          </div>
          <div className="relative flex flex-1 gap-2">
            <div className="flex flex-col gap-1 border-r p-2 text-2xl">
              <div className={cn("rounded p-3", styles.user)}>
                <UserRound />
              </div>
              <div className={cn("rounded p-3", styles.dashboard)}>
                <Gauge />
              </div>
              <div className="p-3">
                <Book />
              </div>
              <div className="p-3">
                <Calendar />
              </div>
              <div className="p-3">
                <Newspaper />
              </div>
              <div className="p-3">
                <Clock />
              </div>
              <div className="p-3">
                <Clapperboard />
              </div>
              <div className="p-3">
                <HelpCircle />
              </div>
            </div>
            <div className={cn("overflow-hidden", styles.drawer)}>
              <div className="flex h-full w-full flex-col gap-2 border-r p-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-[1em] w-[10ch] text-4xl" />
                <div className="h-4" />
                <div className="flex flex-col gap-2">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-8" />
                    ))}
                  <div>Settings</div>
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-8" />
                    ))}
                </div>
              </div>
            </div>
            <div className="grid aspect-video flex-1 overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
              <div
                className={cn(
                  "flex h-full w-full flex-col gap-2 p-4",
                  styles.home,
                )}
              >
                <Skeleton className="h-[1em] w-[10ch] text-4xl" />
                <div className="grid grid-cols-3 gap-2">
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="aspect-square w-full" />
                    ))}
                </div>
              </div>
              <div
                className={cn(
                  "flex h-full w-full flex-col gap-2 p-4",
                  styles.settings,
                )}
              >
                <h2 className="h1">Settings</h2>
                <h3 className="h2">Approved Integrations:</h3>
                <div className="flex flex-col gap-2">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                </div>
                <div>
                  <Button>
                    <Plus /> New Access Token
                  </Button>
                </div>
                <div
                  className={cn(
                    "absolute inset-0 grid place-items-center bg-background/50",
                    styles.modal,
                  )}
                >
                  <div className="rounded-xl border bg-background">
                    <div className="p-4">
                      <h2 className="h3">Generate an Access Token</h2>
                      <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-2">
                          <span>Purpose:</span>
                          <input
                            className="flex-1 rounded border px-3 py-2"
                            readOnly
                            defaultValue="Catalyst"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t bg-secondary/40 p-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Generate Token</Button>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "absolute inset-0 grid place-items-center bg-background/50",
                    styles.token,
                  )}
                >
                  <div className="rounded-xl border bg-background">
                    <div className="p-4">
                      <h2 className="h3">Access Token Details</h2>
                      <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-2">
                          <span>Token:</span>
                          <input
                            className="flex-1 rounded border px-3 py-2"
                            readOnly
                            defaultValue="10968~EavYz7Ee22uWmcN4n9LPU6KCTzDhnHDcaJ9vxTY2yaWQZR62MkXe82MxhwDQwERh"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t bg-secondary/40 p-4">
                      <Button variant="outline">Regenerate</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <MousePointer
              className={cn("absolute origin-top-left text-3xl", styles.cursor)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import {
  Book,
  Calendar,
  CircleSlash,
  Clapperboard,
  Clock,
  Gauge,
  HelpCircle,
  MousePointer,
  Newspaper,
  Plus,
  Trash,
  UserRound,
} from "lucide-react";
import { signOut } from "next-auth/react";

import styles from "./page.module.css";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SettingsPage() {
  const { mutate, isPending } = api.catalyst.user.settings.draft.useMutation();
  const { mutate: deleteAccount } = api.catalyst.user.delete.useMutation();

  return (
    <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
      <div className="flex w-[min(100ch,100%)] flex-col gap-6">
        <h1 className="h1 w-full">Catalyst Settings</h1>
        <h2 className="h2 w-full" id="canvas">
          Canvas Integration
        </h2>
        <Input
          placeholder="Paste your access token here..."
          onChange={(val) => {
            mutate({
              canvasToken: val.target.value,
            });
          }}
          disabled={isPending}
        />
        <p className="-mt-4 px-4 text-xs text-muted">
          Please note: this may take a few seconds to propagate.
        </p>
        <Accordion type="multiple">
          <AccordionItem value="tutorial">
            <AccordionTrigger>Tutorial</AccordionTrigger>
            <AccordionContent>
              <div className="relative flex flex-1 gap-2 rounded border">
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
                  className={cn(
                    "absolute origin-top-left text-3xl",
                    styles.cursor,
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <h2 className="h2 w-full" id="danger">
          Dangerous Actions
        </h2>
        <div className="flex flex-col items-start justify-start gap-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="destructive">
                <Trash /> Delete Account
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Delete Account</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-4 p-4">
                <p>
                  Are you sure you want to delete your account? This action is
                  irreversible.
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      deleteAccount();
                      await signOut();
                    }}
                  >
                    <Trash /> Delete Account
                  </Button>
                  <Button variant="outline">
                    <CircleSlash /> Cancel
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </main>
  );
}

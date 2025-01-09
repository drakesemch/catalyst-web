"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ArrowRight, Bug } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function CanvasWarningPopup() {
  const pathname = usePathname();

  if (pathname.startsWith("/app/settings")) return null;

  return (
    <Drawer open={true}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Canvas needs Attention
          </DrawerTitle>
          <p>
            Your Canvas Token is no longer valid, please proceed to settings to fix this, if this account is no longer needed, feel free to close your account.
          </p>
          <div className="flex justify-end gap-2">
            <CloseAccount />
            <Button href="/app/settings#canvas">Proceed to Settings <ArrowRight /></Button>
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

export function CloseAccount() {
  const { mutate: deleteAccount } = api.catalyst.user.delete.useMutation();

  return (
    <Button variant="destructive" onClick={async () => {
      deleteAccount();
      await signOut();
    }}>
      Close Account
    </Button>
  )
}

export function ReportButton() {
  const isMobile = useMediaQuery({ mediaQuery: "(max-width: 768px)" });
  const pathname = usePathname();

  function ReportForm() {

    const {mutate: report, isPending} = api.catalyst.feedback.provide.useMutation();
  
    const [importance, setImportance] = useState("low");
    const [category, setCategory] = useState("bug");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    return (
      <form onSubmit={async (e) => {
        e.preventDefault();

        report({
          category,
          importance,
          title,
          description,
          pathname,
          date: new Date().toISOString(),
        });

        setCategory("bug");
        setImportance("low");
        setTitle("");
        setDescription("");
      }}>
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex gap-2 items-center">
            <span className="w-[20ch]">Category</span>
            <Select onValueChange={(val) => setCategory(val)} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="visual-bug">Visual Bug</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="flex gap-2 items-center">
            <span className="w-[20ch]">Importance</span>
            <Select onValueChange={(val) => setImportance(val)} value={importance}>
              <SelectTrigger>
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="very">Very</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="flex gap-2 items-center">
            <span className="w-[20ch]">Title</span>
            <Input key="feedback-title" type="text" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="flex gap-2 items-center">
            <span className="w-[20ch]">Description</span>
            <Textarea key="feedback-description" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    );
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
      <Button className={cn("z-50 fixed bottom-20 right-4", pathname == "/app" && "bottom-40")}>
        <Bug /> Report an Issue
      </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Report an Issue
            </DrawerTitle>
            <DrawerDescription>
              Fill out the form to report an issue or send a suggestion
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 @container">
            <ReportForm />
          </div>
        </DrawerContent>
      </Drawer>
    )
  } else {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button className={cn("z-50 fixed bottom-4 right-4", pathname == "/app" && "bottom-24")}>
            <Bug /> Report an Issue
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={4} className="w-96">
          <h2 className="h3">
            Report an Issue
          </h2>
          <p className="text-xs text-muted-foreground">
          Fill out the form to report an issue or send a suggestion
          </p>
          <div className="@container">
            <ReportForm />
          </div>
        </PopoverContent>
      </Popover>
    )
  }
}
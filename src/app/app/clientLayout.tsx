"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { api } from "@/trpc/react";
import { ArrowRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

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
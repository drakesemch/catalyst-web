"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { api } from "@/trpc/react";
import { CircleSlash, Trash } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { mutate: deleteAccount } = api.catalyst.user.delete.useMutation();

  return (
    <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
      <div className="flex w-[min(100ch,100%)] flex-col gap-6">
        <h1 className="h1 w-full">
          Catalyst Settings
        </h1>
        <h2 className="h2 w-full">
          Dangerous Actions
        </h2>
        <div className="flex flex-col gap-4 justify-start items-start">
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
                  Are you sure you want to delete your account? This action is irreversible.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="destructive" onClick={async () => {
                    deleteAccount();
                    await signOut();
                  }}>
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
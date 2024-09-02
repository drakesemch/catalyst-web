import {
  FlaskConical,
  Album,
  UsersRound,
  Wrench,
  Inbox,
  UserCircle,
  Search,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../ui/navigation-menu";
import { Separator } from "../../ui/separator";
import { Button } from "@/components/ui/button";
import { Courses } from "./dynamic-nav";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { HydrateClient, api } from "@/trpc/server";

export async function AppNav() {
  await api.catalyst.user.canvas.courses.list
    .prefetch({
      enrollment_state: "active",
      include: ["total_scores"],
    })
    .catch(console.error);

  return (
    <HydrateClient>
      <NavigationMenu
        viewport={{
          className: "left-[calc(max(calc((100%-120ch)/2),1rem)+10ch)]",
        }}
        className="hidden md:flex"
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/app">
              <FlaskConical />
              Catalyst
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Separator orientation="vertical" className="h-4" />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Album />
              Courses
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex justify-stretch gap-2 p-4">
                <Button
                  variant="secondary"
                  className="flex h-auto min-h-48 w-48 flex-col items-start justify-end gap-2 text-2xl"
                  href="/app/courses"
                >
                  <Album className="text-5xl" strokeWidth={1} />
                  All Courses
                  <span className="h-auto max-w-full whitespace-pre text-wrap text-xs text-muted-foreground">
                    View past and current courses, and view schedule
                    information.
                  </span>
                </Button>
                <Suspense fallback={<CourseLoading />}>
                  <Courses />
                </Suspense>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/app/social">
              <UsersRound />
              Social
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/app/tools">
              <Wrench />
              Tools
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/app/inbox">
              <Inbox />
              Inbox
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Separator orientation="vertical" className="h-4" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="fixed bottom-0 z-10 flex h-[4.5rem] w-full border-t bg-background md:hidden">
        <Link
          href="/app/"
          className="flex flex-1 flex-col items-center justify-center gap-1 [&:hover_[data-icon]]:bg-secondary [&:hover_[data-icon]]:px-6"
        >
          <div data-icon className="rounded-full px-2 py-2 transition-all">
            <FlaskConical />
          </div>
          <span className="text-xs">Catalyst</span>
        </Link>
        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex flex-1 flex-col items-center justify-center gap-1 [&:hover_[data-icon]]:bg-secondary [&:hover_[data-icon]]:px-6">
              <div data-icon className="rounded-full px-2 py-2 transition-all">
                <Album />
              </div>
              <span className="text-xs">Courses</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex flex-row items-center justify-center gap-2">
                <Album /> Courses
              </DrawerTitle>
            </DrawerHeader>
            <Suspense fallback={<CourseLoading />}>
              <Courses />
            </Suspense>
          </DrawerContent>
        </Drawer>
        <button className="flex flex-1 flex-col items-center justify-center gap-1 [&:hover_[data-icon]]:bg-secondary [&:hover_[data-icon]]:px-6">
          <div data-icon className="rounded-full px-2 py-2 transition-all">
            <Wrench />
          </div>
          <span className="text-xs">Tools</span>
        </button>
        <button className="flex flex-1 flex-col items-center justify-center gap-1 [&:hover_[data-icon]]:bg-secondary [&:hover_[data-icon]]:px-6">
          <div data-icon className="rounded-full px-2 py-2 transition-all">
            <UserCircle />
          </div>
          <span className="text-xs">You</span>
        </button>
      </div>
    </HydrateClient>
  );
}

function CourseLoading() {
  return (
    <div className="flex max-h-96 flex-col gap-2 overflow-auto p-2">
      <div className="flex items-center gap-2 rounded border px-3 py-2 [&:has(input:focus-visible)]:outline">
        <Search />
        <input
          type="search"
          placeholder="Search courses..."
          className="flex-1 bg-background outline-none"
        />
      </div>
      {Array(10)
        .fill(0)
        .map((_, idx) => {
          return (
            <div key={idx} className="flex flex-col rounded border">
              <div className="flex items-stretch">
                <Button
                  variant="ghost"
                  className="h-auto flex-1 overflow-hidden rounded-none hover:bg-secondary/70"
                >
                  <div className="flex flex-1 flex-col items-start justify-center gap-1 overflow-hidden">
                    <span className="font-bold">
                      <Skeleton className="h-[1em] w-[20ch]" />
                    </span>
                    <span className="max-w-full truncate text-xs text-muted-foreground">
                      <Skeleton className="h-[1em] w-[30ch]" />
                    </span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="aspect-square h-auto flex-shrink-0 rounded-none border-l hover:bg-secondary/70"
                >
                  <Skeleton className="size-8 rounded-full" />
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

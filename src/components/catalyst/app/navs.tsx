import {
  FlaskConical,
  Album,
  UsersRound,
  Wrench,
  Inbox,
  UserCircle,
  Search,
  // Settings,
  // School,
  // Sparkles,
  // Clock,
  // HelpCircle,
  // PlusCircle,
  // Command,
  UserRound,
  Bell,
  School,
  Home,
  Calculator,
  // Gamepad2,
  Percent,
  Table,
  // File,
  // Text,
  Sparkles,
  Command,
  Settings,
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
import { Courses, Notifications } from "./dynamic-nav";
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
import { UserAvatar } from "../user-avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
// import { OpenCmdK } from "../cmd-k";
import { SignOutButton } from "./dynamic-nav";
// import { expNotifications, /* expFriends */, expTools } from "@/app/flags";
// import { Badge } from "@/components/ui/badge";
import { OpenCmdK } from "../cmd-k";

export async function AppNav() {
  await api.catalyst.user.canvas.courses.list
    .prefetch({
      enrollment_state: "active",
      include: ["total_scores"],
    })
    .catch(console.error);

  const self = await api.catalyst.user.get();

  return (
    <HydrateClient>
      <NavigationMenu
        viewport={{
          className: "left-[calc(max(calc((100%-120ch)/2),1rem)+10ch)]",
        }}
        className="z-20 hidden md:flex"
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/app"
              className="w-10 px-0 lg:w-auto lg:px-4"
            >
              <FlaskConical />
              <span className="hidden lg:inline-block">Catalyst</span>
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
            <NavigationMenuTrigger>
              <UsersRound />
              Social
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex justify-stretch gap-2 p-4">
                <Button
                  variant="secondary"
                  className="flex h-auto min-h-48 w-48 flex-col items-start justify-end gap-2 text-2xl"
                  href="/app/social"
                >
                  <UsersRound />
                  Social
                  <span className="h-auto max-w-full whitespace-pre text-wrap text-xs text-muted-foreground">
                    Connect with friends and classmates.
                  </span>
                </Button>
                <Social />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Wrench />
              Tools
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex justify-stretch gap-2 p-4">
                <Button
                  variant="secondary"
                  className="flex h-auto min-h-48 w-48 flex-col items-start justify-end gap-2 text-2xl"
                  href="/app/tools"
                >
                  <Wrench className="text-5xl" strokeWidth={1} />
                  Tools
                  <span className="h-auto max-w-full whitespace-pre text-wrap text-xs text-muted-foreground">
                    Take advantage of the tools available to you.
                  </span>
                </Button>
                <Tools />
              </div>
            </NavigationMenuContent>
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
          <div className="flex-1" />
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 !rounded-full px-3 lg:px-4"
                  >
                    <span className="hidden lg:inline-block">
                      Notifications
                    </span>
                    <Bell />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-auto p-0"
                  side="bottom"
                  sideOffset={24}
                  align="end"
                >
                  <div className="flex justify-stretch gap-2 p-4">
                    <Notifications />
                  </div>
                </HoverCardContent>
              </HoverCard>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 !rounded-full pr-3"
                  >
                    You
                    <UserAvatar
                      name={self?.name ?? ""}
                      image={self?.image ?? ""}
                      className="text-lg"
                    />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-auto p-0"
                  side="bottom"
                  sideOffset={24}
                  align="end"
                >
                  <div className="flex justify-stretch gap-2 p-4">
                    <Button
                      variant="secondary"
                      className="flex h-auto min-h-48 w-48 flex-col items-start justify-end gap-2 text-2xl"
                    >
                      <UserCircle className="text-5xl" strokeWidth={1} />
                      You
                      <span className="h-auto max-w-full whitespace-pre text-wrap text-left text-xs text-muted-foreground">
                        View and edit your profile, settings, and more.
                      </span>
                    </Button>
                    <SettingCards />
                  </div>
                </HoverCardContent>
              </HoverCard>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="fixed bottom-0 z-20 flex h-[4.5rem] w-full border-t bg-background md:hidden">
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
        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex flex-1 flex-col items-center justify-center gap-1 [&:hover_[data-icon]]:bg-secondary [&:hover_[data-icon]]:px-6">
              <div data-icon className="rounded-full px-2 py-2 transition-all">
                <Wrench />
              </div>
              <span className="text-xs">Tools</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex flex-row items-center justify-center gap-2">
                <Wrench /> Tools
              </DrawerTitle>
            </DrawerHeader>
            <Tools />
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex flex-1 flex-col items-center justify-center gap-1 [&:hover_[data-icon]]:bg-secondary [&:hover_[data-icon]]:px-6">
              <div data-icon className="rounded-full px-2 py-2 transition-all">
                <UserAvatar
                  name={self?.name ?? ""}
                  image={self?.image ?? ""}
                  className="text-lg"
                />
              </div>
              <span className="text-xs">You</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex flex-row items-center justify-center gap-2">
                <UserRound /> You
              </DrawerTitle>
            </DrawerHeader>
            <SettingCards />
          </DrawerContent>
        </Drawer>
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
            <div
              key={`course-load${idx}`}
              className="flex flex-col rounded border"
            >
              <div className="flex items-stretch">
                <Button
                  className="flex h-auto flex-1 flex-col items-start justify-center gap-1 overflow-hidden rounded-none hover:bg-secondary/70"
                  variant="ghost"
                >
                  <span className="font-bold">
                    <Skeleton className="h-[1em] w-[20ch]" />
                  </span>
                  <span className="max-w-full truncate text-xs text-muted-foreground">
                    <Skeleton className="h-[1em] w-[30ch]" />
                  </span>
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

function Social() {
  return (
    <div className="flex max-h-96 max-w-full flex-col gap-2 overflow-auto p-4 md:-m-4 md:max-w-[40ch] md:pr-2">
      <div className="grid h-96 w-[40ch] place-items-center text-center text-xs text-muted-foreground">
        This feature is not available.
        <br /> Check back later for updates.
      </div>
      {/* <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Calculator />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Calculator</span>
          <span className="text-xs text-muted-foreground">
            Perform calculations with ease
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <ChartLine />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Graphing Calculator</span>
          <span className="text-xs text-muted-foreground">
            Plot graphs and functions
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Table />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Periodic Table</span>
          <span className="text-xs text-muted-foreground">
            Explore the elements.
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Percent />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Grade Calculator</span>
          <span className="text-xs text-muted-foreground">
            Enter what-if grades and what-if percentages
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Gamepad2 />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Games</span>
          <span className="text-xs text-muted-foreground">
            Take a break to refocus
          </span>
        </div>
        <Badge variant="secondary">Pre Release</Badge>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Text />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Assignment Summarizer</span>
          <span className="text-xs text-muted-foreground">
            Understand your assignment better
          </span>
        </div>
        <Badge>Pro</Badge>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <File />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Paper Proof-reader</span>
          <span className="text-xs text-muted-foreground">
            Improve your writing
          </span>
        </div>
        <Badge>Pro</Badge>
      </Button> */}
    </div>
  );
}

async function Tools() {
  return (
    <div className="flex max-h-96 max-w-full flex-col gap-2 overflow-auto p-4 md:-m-4 md:max-w-[40ch] md:pr-2">
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
        href="/app/tools/calc"
      >
        <Calculator />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Calculator</span>
          <span className="text-xs text-muted-foreground">
            Perform calculations with ease
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
        href="/app/tools/ptable"
      >
        <Table />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Periodic Table</span>
          <span className="text-xs text-muted-foreground">
            Explore the elements.
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Percent />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Grade Calculator</span>
          <span className="text-xs text-muted-foreground">
            Enter what-if grades and what-if percentages
          </span>
        </div>
      </Button>
      {/* <Button
            variant="outline"
            className="flex h-auto w-full flex-1 items-center gap-3"
          >
            <Gamepad2 />
            <div className="flex flex-1 flex-col items-start gap-1">
              <span className="font-bold">Games</span>
              <span className="text-xs text-muted-foreground">
                Take a break to refocus
              </span>
            </div>
            <Badge variant="secondary">Pre Release</Badge>
          </Button><Button
            variant="outline"
            className="flex h-auto w-full flex-1 items-center gap-3"
          >
            <Text />
            <div className="flex flex-1 flex-col items-start gap-1">
              <span className="font-bold">Assignment Summarizer</span>
              <span className="text-xs text-muted-foreground">
                Understand your assignment better
              </span>
            </div>
            <Badge>Pro</Badge>
          </Button><Button
            variant="outline"
            className="flex h-auto w-full flex-1 items-center gap-3"
          >
            <File />
            <div className="flex flex-1 flex-col items-start gap-1">
              <span className="font-bold">Paper Proof-reader</span>
              <span className="text-xs text-muted-foreground">
                Improve your writing
              </span>
            </div>
            <Badge>Pro</Badge>
          </Button> */}
    </div>
  );
}

async function SettingCards() {
  return (
    <div className="flex max-h-96 max-w-full flex-col gap-2 overflow-auto p-4 md:-m-4 md:w-[40ch] md:max-w-[40ch] md:pr-2">
      {/* <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Clock />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Status</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="size-2 rounded-full bg-green-500" /> Online
          </span>
        </div>
      </Button> */}
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3 md:hidden"
        href="/app/inbox"
      >
        <Inbox />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Inbox</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            View your messages
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3 md:hidden"
      >
        <UsersRound />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Social</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            View your friends and social feed
          </span>
        </div>
      </Button>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="flex h-auto w-full flex-1 items-center gap-3 md:hidden"
          >
            <Bell />
            <div className="flex flex-1 flex-col items-start gap-1">
              <span className="font-bold">Notifications</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Catch up on what you{"'"}ve missed
              </span>
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
          </DrawerHeader>
          <Notifications />
        </DrawerContent>
      </Drawer>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
        href="/app/schools"
      >
        <School />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">School</span>
          <span className="text-xs text-muted-foreground">
            Manage your school information
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="hidden h-auto w-full flex-1 items-center gap-3 md:flex"
      >
        <UsersRound />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Friends</span>
          <span className="text-xs text-muted-foreground">Manage Friends</span>
        </div>
      </Button>
      {/* <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <PlusCircle />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Feedback</span>
          <span className="text-xs text-muted-foreground">
            Send feedback to the Catalyst team
          </span>
        </div>
      </Button> */}
      {/* <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <HelpCircle />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Help</span>
          <span className="text-xs text-muted-foreground">
            Resolve an issue
          </span>
        </div>
      </Button> */}
      <OpenCmdK
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Command />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Command Menu</span>
          <span className="text-xs text-muted-foreground">
            Open the command Palette
          </span>
        </div>
      </OpenCmdK>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Sparkles />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Upgrade to Pro</span>
          <span className="text-xs text-muted-foreground">
            Get access to more features
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        className="flex h-auto w-full flex-1 items-center gap-3"
        href="/app/settings"
      >
        <Settings />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Settings</span>
          <span className="text-xs text-muted-foreground">
            Access all your settings
          </span>
        </div>
      </Button>
      <Button
        variant="outline"
        href="/home"
        className="flex h-auto w-full flex-1 items-center gap-3"
      >
        <Home />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Exit App</span>
          <span className="text-xs text-muted-foreground">
            View the landing page of Catalyst
          </span>
        </div>
      </Button>
      <SignOutButton />
    </div>
  );
}

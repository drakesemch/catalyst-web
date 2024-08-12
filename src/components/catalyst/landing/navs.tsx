import {
  FlaskConical,
  Info,
  CircleDollarSign,
  Newspaper,
  HelpCircle,
  Menu,
  House,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../ui/navigation-menu";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { OpenCmdK } from "../cmd-k";
import { OpenApp } from "./open-app";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export async function LandingNav() {
  return (
    <NavigationMenu
      viewport={{
        className: "left-[calc(max(calc((100%-120ch)/2),1rem)+10ch)]",
      }}
    >
      <NavigationMenuList>
        <NavigationMenuItem className="block md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
                <span className="sr-only">Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="px-8 py-4">
                <DrawerTitle className="h3 flex items-center gap-2">
                  <FlaskConical /> Catalyst
                </DrawerTitle>
              </DrawerHeader>
              <div className="flex w-full flex-col gap-2 p-4 pt-0">
                <Button
                  variant="ghost"
                  className="flex justify-start"
                  href="/home"
                >
                  <House /> Home
                </Button>
                <Button
                  variant="ghost"
                  className="flex justify-start"
                  href="/about"
                >
                  <Info /> About
                </Button>
                <Button
                  variant="ghost"
                  className="flex justify-start"
                  href="/pricing"
                >
                  <CircleDollarSign /> Pricing
                </Button>
                <Button
                  variant="ghost"
                  className="flex justify-start"
                  href="/blog"
                >
                  <Newspaper /> Blog
                </Button>
                <Button
                  variant="ghost"
                  className="flex justify-start"
                  href="/help"
                >
                  <HelpCircle /> Help
                </Button>
                <Separator className="my-2" />
                <OpenApp className="flex justify-start" />
              </div>
            </DrawerContent>
          </Drawer>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/home">
            <FlaskConical />
            Catalyst
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Separator orientation="vertical" className="h-4" />
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuLink href="/about">
            <Info />
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuLink href="/pricing">
            <CircleDollarSign />
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuLink href="/blog">
            <Newspaper />
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuLink href="/help">
            <HelpCircle />
            Help
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Separator orientation="vertical" className="h-4" />
        </NavigationMenuItem>
        <li className="flex-1" />
        <NavigationMenuItem>
          <Suspense fallback={<Skeleton className="h-10 w-[10ch]" />}>
            <OpenApp />
          </Suspense>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function LandingFooter() {
  return (
    <footer className="-mt-3 flex items-center justify-center">
      <div className="flex w-[min(120ch,100%)] flex-col items-center justify-between gap-2 overflow-auto p-8 md:flex-row">
        <div className="flex items-center">
          <Button
            variant="ghost"
            href="/home"
            className="flex items-center gap-2"
          >
            <FlaskConical /> Catalyst
          </Button>
          <Separator
            orientation="vertical"
            className="ml-4 hidden h-4 md:block"
          />
        </div>
        <ul className="flex flex-col gap-4 text-center md:flex-row">
          <li>
            <Button variant="link" href="/home">
              Home
            </Button>
          </li>
          <li>
            <Button variant="link">About</Button>
          </li>
          <li>
            <Button variant="link" href="/pricing">
              Pricing
            </Button>
          </li>
          <li>
            <Button variant="link" href="/blog">
              Blog
            </Button>
          </li>
          <li>
            <Button variant="link" href="/help">
              Help
            </Button>
          </li>
          <li>
            <OpenCmdK variant="link">Cmd K</OpenCmdK>
          </li>
        </ul>
      </div>
    </footer>
  );
}

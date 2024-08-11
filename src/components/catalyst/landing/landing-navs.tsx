import {
  FlaskConical,
  Info,
  CircleDollarSign,
  Newspaper,
  HelpCircle,
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

export function LandingNav() {
  return (
    <NavigationMenu
      viewport={{
        className: "left-[calc(max(calc((100%-120ch)/2),1rem)+10ch)]",
      }}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/home">
            <FlaskConical />
            Catalyst
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Separator orientation="vertical" className="h-4" />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">
            <Info />
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">
            <CircleDollarSign />
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/blog">
            <Newspaper />
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
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
          <OpenApp />
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

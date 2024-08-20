import { FlaskConical, Album, UsersRound, Wrench, Inbox } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../ui/navigation-menu";
import { Separator } from "../../ui/separator";

export async function AppNav() {
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
            <Album />
            Courses
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">
            <UsersRound />
            Social
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">
            <Wrench />
            Tools
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">
            <Inbox />
            Inbox
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Separator orientation="vertical" className="h-4" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

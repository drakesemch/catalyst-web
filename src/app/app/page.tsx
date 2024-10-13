import { TimeOfDay } from "@/components/catalyst/app/time-of-day";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { HomePageCards, NewTodo, Todos } from "./client";
import { api } from "@/trpc/server";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default async function AppPage() {
  const user = await api.catalyst.user.get();
  await api.catalyst.user.canvas.schedule.current.prefetch();

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 lg:flex-row">
      <main className="flex max-w-[100ch] flex-1 flex-col gap-2 p-4 py-16">
        <h1 className="h1 flex flex-wrap gap-3">
          <span className="animate-fade-in opacity-0 animate-delay-400">
            Good
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-600">
            <TimeOfDay />,
          </span>
          <span className="animate-fade-in opacity-0 animate-delay-800">
            {(user?.name ?? "Friend").split(" ").at(0)}!
          </span>
        </h1>
        <HomePageCards />
        <h3 className="h1 mt-4 animate-fade-in text-4xl opacity-0 animate-delay-1200" id="todo">
          Todo
        </h3>
        <p className="animate-fade-in text-lg text-muted-foreground opacity-0 animate-delay-1200">
          Your planned items for the next 14 days.
        </p>
        <div className="flex animate-fade-in flex-col gap-4 opacity-0 animate-delay-1400">
          <Todos />
          <Button
            variant="outline"
            className="h-auto justify-between p-8 text-lg"
          >
            View All <ArrowRight />
          </Button>
        </div>
        <div className="mt-8" />
        <div className="w-full fixed bottom-[4.5rem] md:bottom-0 left-0 border-t bg-background flex items-center justify-center">
          <div className="max-w-[100ch] w-full flex items-center justify-between py-4 px-6">
            <div className="flex flex-col gap-1">
              <span className="font-bold">Catalyst</span>
              <span className="text-xs text-muted-foreground">Created with ❤️ by Drake Semchyshyn and the Blue Flame Team</span>
            </div>
            <NewTodo />
          </div>
        </div>
      </main>
    </div>
  );
}

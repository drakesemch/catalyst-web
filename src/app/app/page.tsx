import { TimeOfDay } from "@/components/catalyst/app/time-of-day";
import { HomePageCards, NewTodo, Todos } from "./client";
import { api } from "@/trpc/server";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";

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
        <h3
          className="h1 mt-4 animate-fade-in text-4xl opacity-0 animate-delay-1200"
          id="todo"
        >
          Todo
        </h3>
        <p className="animate-fade-in text-lg text-muted-foreground opacity-0 animate-delay-1200">
          Your planned items for the next 14 days.
        </p>
        <div className="flex animate-fade-in flex-col gap-4 pt-8 opacity-0 animate-delay-1400">
          <Todos />
          <div className="flex justify-center py-8 text-xs text-muted-foreground">
            Only showing the last 14 days.
          </div>
          {/* <Button
            variant="outline"
            className="h-auto justify-between p-8 text-lg"
          >
            View All <ArrowRight />
          </Button> */}
        </div>
        <div className="mt-8" />
        <div className="fixed bottom-[4.5rem] left-0 flex w-full items-center justify-center bg-background md:bottom-0">
          <SquigglySeparator
            fillColor="hsl(var(--ui-background))"
            waveColor="hsl(var(--ui-secondary))"
            className="absolute -top-4 left-0 w-full rotate-180"
          />
          <div className="flex w-full max-w-[100ch] items-center justify-between p-6 pb-5 pt-4">
            <div className="flex flex-col gap-1">
              <span className="font-bold">Catalyst</span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Created with ❤️ by Drake Semchyshyn and the Blue Flame Team
              </span>
              <span className="block text-xs text-muted-foreground sm:hidden">
                Created with ❤️
              </span>
            </div>
            <NewTodo />
          </div>
        </div>
      </main>
    </div>
  );
}

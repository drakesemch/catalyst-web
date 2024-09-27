import { TimeOfDay } from "@/components/catalyst/app/time-of-day";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Dot, SquareArrowOutUpRight } from "lucide-react";
import { Todos } from "./client";
import { expHomePageCards } from "../flags";
import { api } from "@/trpc/server";

export default async function AppPage() {
  const user = await api.catalyst.user.get();
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
        {(await expHomePageCards()) ? (
          <div className="-mx-[max(calc((100vw-100ch+2rem-20px)/2),1rem)] mt-4 flex animate-fade-in items-center gap-4 overflow-auto px-[max(calc((100vw-100ch+2rem-20px)/2),1rem)] pb-4 opacity-0 animate-delay-1000">
            <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
              <CardHeader>
                <CardTitle>Current Class</CardTitle>
                <CardDescription>
                  Science (AP Physics 1-Wedermyer-S1-2024)
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button href="/app/courses">
                  Open Course <ArrowRight />
                </Button>
              </CardFooter>
            </Card>
            <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
              <CardHeader>
                <CardTitle>Time Remaining</CardTitle>
                <CardDescription>32 minutes remaining</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" href="/app/schedule/">
                  Open Schedule <ArrowRight />
                </Button>
                <Button variant="outline" href="/app/schedule/now">
                  View In Fullscreen <SquareArrowOutUpRight />
                </Button>
              </CardFooter>
            </Card>
            <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>
                  1 missing assignment <Dot /> 3 assignments due soon
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" href="/app/todo">
                  View Todo List <ArrowRight />
                </Button>
              </CardFooter>
            </Card>
            <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>1 new inbox message</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" href="/app/inbox">
                  Open Inbox <ArrowRight />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <></>
        )}
        <h3 className="h1 mt-4 animate-fade-in text-4xl opacity-0 animate-delay-1200">
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
      </main>
    </div>
  );
}

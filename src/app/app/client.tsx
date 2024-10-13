"use client";

import { api } from "@/trpc/react";
import { TodoCard } from "@/components/catalyst/app/todo";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { format, formatDistanceStrict, isAfter, isBefore, isEqual } from "date-fns";

export function Todos() {
  const { data, isPending } = api.canvas.todo.upcoming.useQuery();

  if (isPending) {
    return (
      <>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
      </>
    );
  }

  return (
    <>
      {data
        ?.sort((a, b) =>
          Number(new Date(a?.plannable.todo_date ?? 0)) >
            Number(new Date(b?.plannable.todo_date ?? 0))
            ? -1
            : 1,
        )
        .map((todo) => <TodoCard key={todo.plannable_id} todo={todo} />)}
    </>
  );
}

export function HomePageCards() {
  const [schedule] =
    api.catalyst.user.canvas.schedule.current.useSuspenseQuery();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const setNewDate = setInterval(() => {
      setNow(new Date());
    });
    return () => clearInterval(setNewDate);
  }, []);

  const currentClass = useMemo(() => {
    let currentPeriods = schedule.times.filter((period) => typeof period.schedule_value.value != "boolean" || period.schedule_value.value != false).filter((period) => isAfter(
      now,
      new Date(
        new Date(
          format(now, "yyyy-MM-dd ") +
          period?.period_time?.start +
          " UTC",
        ),
      ),
    ) &&
      isBefore(
        now,
        new Date(
          new Date(
            format(now, "yyyy-MM-dd ") +
            period?.period_time?.end +
            " UTC",
          ),
        ),
      ));
    if (currentPeriods.length == 0) {
      currentPeriods = schedule.times.filter((period) => typeof period.schedule_value.value != "boolean" || period.schedule_value.value != false).filter((period) => isBefore(
        now,
        new Date(
          new Date(
            format(now, "yyyy-MM-dd ") +
            period?.period_time?.start +
            " UTC",
          ),
        ),
      ))
    };
    let currentPeriod = null;
    if (currentPeriods.length > 0) {
      currentPeriod = currentPeriods.reduce((a, b) => {
        if (Number(new Date(
          format(now, "yyyy-MM-dd ") +
          a?.period_time?.end +
          " UTC",
        )) < Number(new Date(
          format(now, "yyyy-MM-dd ") +
          b?.period_time?.end +
          " UTC",
        ))) {
          return a;
        } else {
          return b;
        }
      });
    }
    return currentPeriod;
  }, [schedule, now]);

  const dateToCompare = useMemo(() => {
    const startDate = new Date(
      format(now, "yyyy-MM-dd ") +
      currentClass?.period_time?.start +
      " UTC",
    );
    const endDate = new Date(
      format(now, "yyyy-MM-dd ") +
      currentClass?.period_time?.end +
      " UTC",
    );

    if (isBefore(now, startDate)) {
      return startDate;
    } else {
      return endDate;
    }
  }, [currentClass?.period_time, now]);

  return (
    <div className="-mx-[max(calc((100vw-100ch+2rem-20px)/2),1rem)] mt-4 flex items-stretch animate-fade-in items-center gap-4 overflow-auto px-[max(calc((100vw-100ch+2rem-20px)/2),1rem)] pb-4 opacity-0 animate-delay-1000">
      {currentClass != null ? (
        <>
          <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
            <CardHeader>
              <CardTitle>Current Class</CardTitle>
              <CardDescription>
                {typeof currentClass?.schedule_value.value == "boolean" && currentClass?.schedule_value.value == true ? (
                  <>{currentClass?.period?.periodName} ({currentClass?.period?.optionName})</>
                ) : (
                  <>{currentClass?.schedule_value.value.classification} ({currentClass?.schedule_value.value.original_name})</>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button href={`/app/courses/${currentClass?.schedule_value.value?.id ?? ""}`}>
                Open Course <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
          <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
            <CardHeader>
              <CardTitle>Time Remaining</CardTitle>
              <CardDescription>
                {isEqual(dateToCompare, new Date(format(now, "yyyy-MM-dd ") + currentClass?.period_time?.end + " UTC")) ? "Ends" : "Starts"}
                {" "}{formatDistanceStrict(dateToCompare, now, { addSuffix: true })}
              </CardDescription>
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
        </>
      ) : (
        <>
          <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
            <CardHeader>
              <CardTitle>No Current Class</CardTitle>
              <CardDescription>
                You are not currently in a class
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button href="/app/courses" variant="secondary">
                View All Courses <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
          <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>
                View your upcoming schedule
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" href="/app/schedule/">
                Open Schedule <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
      <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            View your upcoming assignments
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" href="#todo">
            View Todo List <ArrowDown />
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>View your messages</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" href="/app/inbox">
            Open Inbox <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
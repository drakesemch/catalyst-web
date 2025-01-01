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
import {
  ArrowDown,
  ArrowRight,
  Calendar as CalendarIcon,
  CircleSlash,
  Loader,
  Plus,
  Save,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  format,
  formatDistanceStrict,
  isAfter,
  isBefore,
  isEqual,
} from "date-fns";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Todos() {
  const { data, isPending } = api.canvas.todo.upcoming.useQuery();

  if (isPending) {
    return (
      <>
        <div className="sticky top-12 z-10 mx-auto -mb-32 mt-16 flex flex-col gap-2 rounded-lg bg-background px-4 py-2 text-xs text-muted-foreground md:top-24">
          <h3 className="flex items-center gap-2">
            <Loader className="animate-spin" /> Loading Todo Items...
          </h3>
        </div>
        <div className="flex flex-col gap-4 blur-xl">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
        </div>
      </>
    );
  }

  if (data?.length == 0) {
    return (
      <h3 className="flex w-full items-center justify-center gap-2 rounded border border-dashed p-16 text-xs text-muted-foreground">
        No Todo Items Found <CircleSlash />
      </h3>
    );
  }

  return (
    <>
      {data
        ?.sort((a, b) => {
          const dateA = new Date(a?.plannable?.todo_date ?? 0);
          const dateB = new Date(b?.plannable?.todo_date ?? 0);
          return dateA > dateB ? -1 : 1;
        })
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
    let currentPeriods = schedule.times
      .filter(
        (period) =>
          typeof period.schedule_value.value != "boolean" ||
          period.schedule_value.value != false,
      )
      .filter(
        (period) =>
          isAfter(
            now,
            new Date(
              format(now, "yyyy-MM-dd'T'") + period?.period_time?.start + "Z",
            ),
          ) &&
          isBefore(
            now,
            new Date(
              format(now, "yyyy-MM-dd'T'") + period?.period_time?.end + "Z",
            ),
          ),
      );
    const inBetweenPeriods = schedule.times
      .filter(
        (period) =>
          typeof period.schedule_value.value != "boolean" ||
          period.schedule_value.value != false,
      )
      .filter((period) =>
        currentPeriods.some(
          (currentPeriod) =>
            isBefore(
              new Date(
                format(now, "yyyy-MM-dd'T'") + period?.period_time?.start + "Z",
              ),
              new Date(
                format(now, "yyyy-MM-dd'T'") +
                  currentPeriod?.period_time?.end +
                  "Z",
              ),
            ) &&
            isAfter(
              new Date(
                format(now, "yyyy-MM-dd'T'") + period?.period_time?.end + "Z",
              ),
              new Date(
                format(now, "yyyy-MM-dd'T'") +
                  currentPeriod?.period_time?.start +
                  "Z",
              ),
            ) &&
            isBefore(
              new Date(),
              new Date(
                format(now, "yyyy-MM-dd'T'") + period?.period_time?.end + "Z",
              ),
            ),
        ),
      );

    currentPeriods = [...currentPeriods, ...inBetweenPeriods];
    if (currentPeriods.length == 0) {
      currentPeriods = schedule.times
        .filter(
          (period) =>
            typeof period.schedule_value.value != "boolean" ||
            period.schedule_value.value != false,
        )
        .filter((period) =>
          isBefore(
            now,
            new Date(
              format(now, "yyyy-MM-dd'T'") + period?.period_time?.start + "Z",
            ),
          ),
        );
    }
    if (currentPeriods.length == 0) {
      return null;
    }
    const currentPeriod = currentPeriods.reduce((a, b) => {
      if (
        Number(
          new Date(format(now, "yyyy-MM-dd'T'") + a?.period_time?.end + "Z"),
        ) <
        Number(
          new Date(format(now, "yyyy-MM-dd'T'") + b?.period_time?.end + "Z"),
        )
      ) {
        return a;
      } else {
        return b;
      }
    });
    return currentPeriod;
  }, [schedule, now]);

  const dateToCompare = useMemo(() => {
    const startDate = new Date(
      format(now, "yyyy-MM-dd'T'") + currentClass?.period_time?.start + "Z",
    );
    const endDate = new Date(
      format(now, "yyyy-MM-dd'T'") + currentClass?.period_time?.end + "Z",
    );

    if (isBefore(now, startDate)) {
      return startDate;
    } else {
      return endDate;
    }
  }, [currentClass?.period_time, now]);

  return (
    <div className="-mx-[max(calc((100vw-100ch+2rem-20px)/2),1rem)] mt-4 flex animate-fade-in items-stretch gap-4 overflow-auto px-[max(calc((100vw-100ch+2rem-20px)/2),1rem)] pb-4 opacity-0 animate-delay-1000">
      {currentClass != null ? (
        <>
          <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
            <CardHeader>
              <CardTitle>Current Class</CardTitle>
              <CardDescription>
                {typeof currentClass?.schedule_value.value == "boolean" &&
                currentClass?.schedule_value.value == true ? (
                  <>
                    {currentClass?.period?.periodName} (
                    {currentClass?.period?.optionName})
                  </>
                ) : (
                  <>
                    {currentClass?.schedule_value.value.classification} (
                    {currentClass?.schedule_value.value.original_name})
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                href={`/app/courses/${currentClass?.schedule_value.value?.id ?? ""}`}
              >
                Open Course <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
          <Card className="w-[40ch] max-w-[40ch] flex-shrink-0">
            <CardHeader>
              <CardTitle>Time Remaining</CardTitle>
              <CardDescription>
                {isEqual(
                  dateToCompare,
                  new Date(
                    format(now, "yyyy-MM-dd'T'") +
                      currentClass?.period_time?.end +
                      "Z",
                  ),
                )
                  ? "Ends"
                  : "Starts"}{" "}
                {formatDistanceStrict(dateToCompare, now, { addSuffix: true })}
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
              <CardDescription>View your upcoming schedule</CardDescription>
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
          <CardDescription>View your upcoming assignments</CardDescription>
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

export function NewTodo() {
  const { mutate: createTodo, isPending } =
    api.canvas.todo.create.useMutation();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Add Todo Item <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Todo Item</DrawerTitle>
          <DrawerDescription>Add an item to your todo list</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span className="font-bold">Title</span>
            <Input
              placeholder="New Todo Item"
              className="w-full sm:w-[31ch]"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span className="font-bold">Due Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start sm:w-[30ch]"
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DrawerFooter className="flex flex-row items-center justify-end gap-2">
          <DrawerClose asChild>
            <Button variant="outline">
              Cancel <CircleSlash />
            </Button>
          </DrawerClose>
          <Button
            onClick={() =>
              createTodo({
                title,
                due_at: date ? format(date, "yyyy-MM-dd") : undefined,
              })
            }
            disabled={isPending}
          >
            {isPending ? (
              <>
                Saving <Loader className="animate-spin" />
              </>
            ) : (
              <>
                Save <Save />
              </>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

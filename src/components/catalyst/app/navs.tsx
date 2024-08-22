"use client";

import {
  FlaskConical,
  Album,
  UsersRound,
  Wrench,
  Inbox,
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
import { api } from "@/trpc/react";
import { PercentageChart } from "./percentage-chart";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  differenceInSeconds,
  format,
  formatDistanceStrict,
  isAfter,
  isBefore,
} from "date-fns";
import { cn } from "@/lib/utils";

export function AppNav() {
  const [{ data: courses }] = api.catalyst.user.canvas.courses.useSuspenseQuery(
    {
      enrollment_state: "active",
      include: ["total_scores"],
    },
  );

  const [courseSearch, setCourseSearch] = useState("");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setNow(new Date());
    });
  }, []);

  return (
    <NavigationMenu
      viewport={{
        className: "left-[calc(max(calc((100%-120ch)/2),1rem)+10ch)]",
      }}
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
                  View past and current courses, and view schedule information.
                </span>
              </Button>
              <div className="flex max-h-96 flex-col gap-2 overflow-auto p-2">
                <div className="flex items-center gap-2 rounded border px-3 py-2 [&:has(input:focus-visible)]:outline">
                  <Search />
                  <input
                    type="search"
                    placeholder="Search courses..."
                    className="flex-1 bg-background outline-none"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>
                {courses.filter((course) => {
                  if (courseSearch == "") return true;
                  return (
                    (course.period?.periodName
                      ?.toLowerCase()
                      .includes(courseSearch.toLowerCase()) ??
                      false) ||
                    course.classification
                      .toLowerCase()
                      .includes(courseSearch.toLowerCase()) ||
                    course.original_name
                      .toLowerCase()
                      .includes(courseSearch.toLowerCase())
                  );
                }).length == 0 && (
                  <div className="flex w-96 items-center justify-center p-2 text-muted-foreground">
                    No courses found.
                  </div>
                )}
                {courses
                  .filter((course) => {
                    if (courseSearch == "") return true;
                    return (
                      (course.period?.periodName
                        ?.toLowerCase()
                        .includes(courseSearch.toLowerCase()) ??
                        false) ||
                      course.classification
                        .toLowerCase()
                        .includes(courseSearch.toLowerCase()) ||
                      course.original_name
                        .toLowerCase()
                        .includes(courseSearch.toLowerCase())
                    );
                  })
                  .map((course) => {
                    const diffPct = isBefore(
                      new Date(),
                      new Date(
                        format(now, "yyyy-MM-dd ") +
                          course.time?.start +
                          " UTC",
                      ),
                    )
                      ? 0
                      : differenceInSeconds(
                          new Date(),
                          new Date(
                            format(now, "yyyy-MM-dd ") +
                              course.time?.start +
                              " UTC",
                          ),
                        ) /
                        differenceInSeconds(
                          new Date(
                            format(now, "yyyy-MM-dd ") +
                              course.time?.end +
                              " UTC",
                          ),
                          new Date(
                            format(now, "yyyy-MM-dd ") +
                              course.time?.start +
                              " UTC",
                          ),
                        );
                    const isCurrent =
                      isAfter(
                        now,
                        new Date(
                          new Date(
                            format(now, "yyyy-MM-dd ") +
                              course.time?.start +
                              " UTC",
                          ),
                        ),
                      ) &&
                      isBefore(
                        now,
                        new Date(
                          new Date(
                            format(now, "yyyy-MM-dd ") +
                              course.time?.end +
                              " UTC",
                          ),
                        ),
                      );
                    return (
                      <div
                        key={course.id}
                        className={cn(
                          "flex w-96 flex-col rounded border",
                          isCurrent && "bg-secondary",
                        )}
                      >
                        <div className="flex items-stretch">
                          <Button
                            variant={isCurrent ? "secondary" : "ghost"}
                            className={cn(
                              "h-auto flex-1 overflow-hidden rounded-none",
                              isCurrent
                                ? "hover:bg-background/30"
                                : "hover:bg-secondary/70",
                            )}
                            href={`/app/courses/${course.id}`}
                          >
                            <div className="flex flex-1 flex-col items-start justify-center gap-1 overflow-hidden">
                              <span className="font-bold">
                                {course.period?.periodName != undefined
                                  ? `${course.period?.periodName}: `
                                  : undefined}
                                {course.classification}
                              </span>
                              <span className="max-w-full truncate text-xs text-muted-foreground">
                                {course.original_name}
                              </span>
                            </div>
                          </Button>
                          <Button
                            variant={isCurrent ? "secondary" : "ghost"}
                            className={cn(
                              "aspect-square h-auto flex-shrink-0 rounded-none border-l",
                              isCurrent
                                ? "border-l-background hover:bg-background/30"
                                : "hover:bg-secondary/70",
                            )}
                            href={`/app/courses/${course.id}/grades`}
                          >
                            <PercentageChart
                              pct={
                                course.enrollments?.at(0)
                                  ?.computed_current_score ?? -1
                              }
                              className="pointer-events-none"
                            />
                          </Button>
                        </div>
                        {course.time && (
                          <div
                            className={cn(
                              "flex flex-col border-t",
                              isCurrent && "border-t-background",
                            )}
                          >
                            <div className="flex items-center gap-4 px-4 py-2 text-xs">
                              {isCurrent && (
                                <div className="-mr-2 size-2 rounded-full bg-green-500" />
                              )}
                              <span>
                                {format(
                                  new Date(
                                    format(now, "yyyy-MM-dd ") +
                                      course.time.start +
                                      " UTC",
                                  ),
                                  "hh:mm a",
                                )}
                              </span>
                              <Progress
                                className={cn(
                                  "flex-1",
                                  isCurrent && "bg-background",
                                )}
                                value={
                                  isBefore(
                                    now,
                                    new Date(
                                      new Date(
                                        format(now, "yyyy-MM-dd ") +
                                          course.time.start +
                                          " UTC",
                                      ),
                                    ),
                                  )
                                    ? 0
                                    : Math.min(100, Math.max(0, diffPct * 100))
                                }
                              />
                              <span>
                                {format(
                                  new Date(
                                    format(now, "yyyy-MM-dd ") +
                                      course.time.end +
                                      " UTC",
                                  ),
                                  "hh:mm a",
                                )}
                              </span>
                            </div>
                            <div className="-mt-2 flex items-center justify-between gap-4 px-4 py-2 text-xs text-muted-foreground">
                              <span>
                                {isBefore(
                                  new Date(),
                                  new Date(
                                    format(now, "yyyy-MM-dd ") +
                                      course.time.start +
                                      " UTC",
                                  ),
                                )
                                  ? "Starts "
                                  : "Started "}
                                {formatDistanceStrict(
                                  new Date(
                                    format(now, "yyyy-MM-dd ") +
                                      course.time.start +
                                      " UTC",
                                  ),
                                  new Date(),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </span>
                              <span>
                                {isBefore(
                                  new Date(),
                                  new Date(
                                    format(now, "yyyy-MM-dd ") +
                                      course.time.end +
                                      " UTC",
                                  ),
                                )
                                  ? "Ends "
                                  : "Ended "}
                                {formatDistanceStrict(
                                  new Date(
                                    format(now, "yyyy-MM-dd ") +
                                      course.time.end +
                                      " UTC",
                                  ),
                                  new Date(),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
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
  );
}

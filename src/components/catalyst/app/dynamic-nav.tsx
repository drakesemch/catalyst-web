"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  isBefore,
  format,
  differenceInSeconds,
  isAfter,
  formatDistanceStrict,
} from "date-fns";
import { Progress } from "@/components/ui/progress";
import {
  Archive,
  Bell,
  BellDot,
  CircleAlert,
  LogOut,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PercentageChart } from "./percentage-chart";
import { Notification, type NotificationMeta } from "./notifications";
import { signOut } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

export function Courses() {
  const [{ data: courses }] =
    api.catalyst.user.canvas.courses.list.useSuspenseQuery({
      enrollment_state: "active",
      include: ["total_scores"],
    });

  const [classifications, setClassifications] = useState<
    Record<number, string>
  >(
    JSON.parse(localStorage.getItem("classifications") ?? "{}") as Record<
      number,
      string
    >,
  );

  const { mutate: genClassification } =
    api.catalyst.user.canvas.courses.genClassification.useMutation({
      onSuccess: (data) => {
        if (!data) return;
        setClassifications((classifications) => {
          classifications[data[0]] = data[1];
          localStorage.setItem(
            "classifications",
            JSON.stringify(classifications),
          );
          return classifications;
        });
      },
    });

  useEffect(() => {
    courses?.forEach((course) => {
      if (classifications[course.id] == undefined) {
        genClassification({ courseId: course.id });
      }
    });
  }, [classifications, courses, genClassification]);

  const [courseSearch, setCourseSearch] = useState("");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const setNewDate = setInterval(() => {
      setNow(new Date());
    });
    return () => clearInterval(setNewDate);
  }, []);

  return (
    <div className="flex max-h-96 max-w-full flex-col gap-2 overflow-auto p-4 md:-m-4 md:w-[40ch] md:pr-2">
      <label className="flex cursor-text items-center gap-2 rounded border bg-background px-3 py-2 [&:has(input:focus-visible)]:outline">
        <Search />
        <input
          type="search"
          placeholder="Search courses..."
          className="flex-1 bg-background outline-none"
          value={courseSearch}
          onChange={(e) => setCourseSearch(e.target.value)}
        />
      </label>
      {courses.filter((course) => {
        if (courseSearch == "") return true;
        return (
          (course.period?.periodName
            ?.toLowerCase()
            .includes(courseSearch.toLowerCase()) ??
            false) ||
          (Object.entries(classifications)
            .find((c) => Number(c[0]) == course.id)?.[1]
            .includes(courseSearch.toLowerCase()) ??
            false) ||
          course.original_name
            .toLowerCase()
            .includes(courseSearch.toLowerCase())
        );
      }).length == 0 && (
        <div className="w-84 flex items-center justify-center p-2 text-xs text-muted-foreground">
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
            (Object.entries(classifications)
              .find((c) => Number(c[0]) == course.id)?.[1]
              .includes(courseSearch.toLowerCase()) ??
              false) ||
            course.original_name
              .toLowerCase()
              .includes(courseSearch.toLowerCase())
          );
        })
        .map((course) => {
          const diffPct = isBefore(
            new Date(),
            new Date(
              format(now, "yyyy-MM-dd") + "T" + course.time?.start + "Z",
            ),
          )
            ? 0
            : differenceInSeconds(
                new Date(),
                new Date(
                  format(now, "yyyy-MM-dd") + "T" + course.time?.start + "Z",
                ),
              ) /
              differenceInSeconds(
                new Date(
                  format(now, "yyyy-MM-dd") + "T" + course.time?.end + "Z",
                ),
                new Date(
                  format(now, "yyyy-MM-dd") + "T" + course.time?.start + "Z",
                ),
              );
          const isCurrent =
            isAfter(
              now,
              new Date(
                new Date(
                  format(now, "yyyy-MM-dd") + "T" + course.time?.start + "Z",
                ),
              ),
            ) &&
            isBefore(
              now,
              new Date(
                new Date(
                  format(now, "yyyy-MM-dd") + "T" + course.time?.end + "Z",
                ),
              ),
            );
          const classification = Object.entries(classifications).find(
            (c) => Number(c[0]) == course.id,
          )?.[1];

          return (
            <div
              key={course.id ?? -1}
              className={cn(
                "flex w-full flex-col rounded border",
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
                      {classification ?? "No classification"}
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
                      course.enrollments?.at(0)?.computed_current_score ?? -1
                    }
                    className="pointer-events-none"
                  />
                </Button>
              </div>
              {course.data.missingAssignments > 0 && (
                <div
                  className={cn(
                    "flex items-center justify-start gap-2 border-t px-4 py-2 text-xs text-red-500",
                    isCurrent && "border-t-background",
                  )}
                >
                  <CircleAlert />
                  <span>
                    {course.data.missingAssignments} missing assignment
                    {course.data.missingAssignments != 1 && "s"}
                  </span>
                </div>
              )}
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
                          format(now, "yyyy-MM-dd") +
                            "T" +
                            course.time.start +
                            "Z",
                        ),
                        "hh:mm a",
                      )}
                    </span>
                    <Progress
                      className={cn("flex-1", isCurrent && "bg-background")}
                      value={
                        isBefore(
                          now,
                          new Date(
                            new Date(
                              format(now, "yyyy-MM-dd") +
                                "T" +
                                course.time.start +
                                "Z",
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
                          format(now, "yyyy-MM-dd") +
                            "T" +
                            course.time.end +
                            "Z",
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
                          format(now, "yyyy-MM-dd") +
                            "T" +
                            course.time.start +
                            "Z",
                        ),
                      )
                        ? "Starts "
                        : "Started "}
                      {formatDistanceStrict(
                        new Date(
                          format(now, "yyyy-MM-dd") +
                            "T" +
                            course.time.start +
                            "Z",
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
                          format(now, "yyyy-MM-dd") +
                            "T" +
                            course.time.end +
                            "Z",
                        ),
                      )
                        ? "Ends "
                        : "Ended "}
                      {formatDistanceStrict(
                        new Date(
                          format(now, "yyyy-MM-dd") +
                            "T" +
                            course.time.end +
                            "Z",
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
  );
}

export function DesktopNotificationTrigger() {
  const { data: activeNotifications } =
    api.catalyst.user.notifications.list.active.useQuery();

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 !rounded-full px-3 lg:px-4"
            >
              <span className="hidden lg:inline-block">Notifications</span>
              <Bell />
              {(activeNotifications?.length ?? 0) > 0 && (
                <Badge className="grid size-4 place-items-center p-0">
                  {activeNotifications?.length}
                </Badge>
              )}
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
  );
}

export function NotificationUpdater() {
  // const utils = api.useUtils();
  // const { channel } = useContext(RealtimeContext);

  // useEffect(() => {
  //   if (!channel) return;
  //   (async () => {
  //     await channel.subscribe("notification", (message) => {
  //       const data = message.data as NotificationMeta["data"];
  //       utils.catalyst.user.notifications.list.active.setData(
  //         undefined,
  //         (prev) => {
  //           if (!prev) return prev;
  //           return [
  //             ...prev,
  //             {
  //               id: message.id,
  //               userId: "",
  //               dismissed: false,
  //               sentAt: new Date(),
  //               data: data,
  //             },
  //           ];
  //         },
  //       );
  //       newPopupNotification({
  //         notification: message as unknown as NotificationMeta,
  //       });
  //     });
  //   })().catch(console.error);
  // }, [channel, utils.catalyst.user.notifications.list.active]);

  return <></>;
}

export function Notifications() {
  const utils = api.useUtils();

  const { data: activeNotifications, isPending: activePending } =
    api.catalyst.user.notifications.list.active.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { data: archivedNotifications, isPending: archivedPending } =
    api.catalyst.user.notifications.list.archived.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  function TabContent({
    value,
    pending,
    notifications,
    emptyMessage,
  }: {
    value: string;
    pending: boolean;
    notifications: NotificationMeta[] | undefined;
    emptyMessage: string;
  }) {
    return (
      <TabsContent value={value} className="mt-0 flex flex-col gap-1">
        {(() => {
          if (pending) {
            return Array(5)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-48" />);
          }
          if (notifications?.length == 0) {
            return (
              <div className="flex max-h-96 flex-col gap-2 overflow-auto p-4 md:w-[40ch]">
                <div className="grid h-96 w-full place-items-center text-center text-xs text-muted-foreground">
                  {emptyMessage}
                  <br /> Check back later for updates.
                </div>
              </div>
            );
          } else {
            return notifications?.map((notification) => (
              <div
                className="overflow-hidden rounded-lg border"
                key={notification.id}
              >
                <Notification
                  toast={undefined}
                  notification={notification}
                  onUpdate={(updatedNotification: NotificationMeta) => {
                    type NotificationType = {
                      data: unknown;
                      id: string;
                      userId: string;
                      sentAt: Date;
                      dismissed: boolean;
                    };
                    // Remove from active list if currently active
                    utils.catalyst.user.notifications.list.active.setData(
                      undefined,
                      (prev) => {
                        if (!prev) return prev;
                        if (notification.dismissed) {
                          return [
                            ...prev,
                            updatedNotification as NotificationType,
                          ];
                        }
                        return prev.filter((n) => n.id !== notification.id);
                      },
                    );

                    // Remove from archived list if currently archived
                    utils.catalyst.user.notifications.list.archived.setData(
                      undefined,
                      (prev) => {
                        if (!prev) return prev;
                        if (!notification.dismissed) {
                          return [
                            ...prev,
                            updatedNotification as NotificationType,
                          ];
                        }
                        return prev.filter((n) => n.id !== notification.id);
                      },
                    );
                  }}
                />
              </div>
            ));
          }
        })()}
      </TabsContent>
    );
  }

  return (
    <div className="flex max-h-96 flex-col gap-2 overflow-auto md:w-[40ch]">
      <Tabs defaultValue="active">
        <TabsList className="w-full">
          <span className="mr-auto flex items-center gap-1 px-2 text-xs">
            <Bell /> Notifications
          </span>
          <TabsTrigger value="active">
            <BellDot /> Active
          </TabsTrigger>
          <TabsTrigger value="archived">
            <Archive /> Archived
          </TabsTrigger>
        </TabsList>
        <TabContent
          value="active"
          pending={activePending}
          notifications={activeNotifications as unknown as NotificationMeta[]}
          emptyMessage="No new notifications available."
        />
        <TabContent
          value="archived"
          pending={archivedPending}
          notifications={archivedNotifications as unknown as NotificationMeta[]}
          emptyMessage="No archived notifications available."
        />
      </Tabs>
    </div>
  );
}

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="flex h-auto w-full flex-1 items-center gap-3"
      onClick={() => signOut()}
    >
      <LogOut />
      <div className="flex flex-1 flex-col items-start gap-1">
        <span className="font-bold">Sign out</span>
        <span className="text-xs text-muted-foreground">
          Sign out of your account
        </span>
      </div>
    </Button>
  );
}

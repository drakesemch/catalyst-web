"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, fromUTCTime } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  differenceInSeconds,
  format,
  formatDistanceStrict,
  isAfter,
  isBefore,
} from "date-fns";
import { useEffect, useState } from "react";

export function ScheduleClientPage() {
  const [schedule] =
    api.catalyst.user.canvas.schedule.current.useSuspenseQuery();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const setNewDate = setInterval(() => {
      setNow(new Date());
    });
    return () => clearInterval(setNewDate);
  }, []);

  return (
    <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
      <div className="flex w-[min(100ch,100%)] flex-col gap-6">
        <h1 className="h1">{schedule?.name} Schedule</h1>
        <div className="flex flex-col gap-2">
          {schedule.times
            .sort(
              (a, b) =>
                Number(fromUTCTime(a?.period_time?.start ?? "0:00")) -
                Number(fromUTCTime(b?.period_time?.start ?? "0:00")),
            )
            .map((period) => {
              const diffPct = isBefore(
                new Date(),
                new Date(
                  format(now, "yyyy-MM-dd") +
                    "T" +
                    period?.period_time?.start +
                    "Z",
                ),
              )
                ? 0
                : differenceInSeconds(
                    new Date(),
                    new Date(
                      format(now, "yyyy-MM-dd") +
                        "T" +
                        period?.period_time?.start +
                        "Z",
                    ),
                  ) /
                  differenceInSeconds(
                    new Date(
                      format(now, "yyyy-MM-dd") +
                        "T" +
                        period?.period_time?.end +
                        "Z",
                    ),
                    new Date(
                      format(now, "yyyy-MM-dd") +
                        "T" +
                        period?.period_time?.start +
                        "Z",
                    ),
                  );
              const isCurrent =
                isAfter(
                  now,
                  new Date(
                    format(now, "yyyy-MM-dd") +
                      "T" +
                      period?.period_time?.start +
                      "Z",
                  ),
                ) &&
                isBefore(
                  now,
                  new Date(
                    format(now, "yyyy-MM-dd") +
                      "T" +
                      period?.period_time?.end +
                      "Z",
                  ),
                );

              return (
                <div
                  key={period?.period?.id ?? -1}
                  className={cn(
                    "flex w-full flex-col rounded border",
                    typeof period?.schedule_value?.value == "boolean" &&
                      period?.schedule_value?.value == false &&
                      "opacity-20",
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
                    >
                      <div className="flex flex-1 flex-col items-start justify-center gap-1 overflow-hidden">
                        <span className="font-bold">
                          {period?.period?.periodName}
                        </span>
                        <span className="max-w-full truncate text-xs text-muted-foreground">
                          {period?.period?.optionName}
                        </span>
                      </div>
                    </Button>
                  </div>
                  {period?.period_time && (
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
                                period?.period_time?.start +
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
                                    period?.period_time?.start +
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
                                period?.period_time?.end +
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
                                period?.period_time?.start +
                                "Z",
                            ),
                          )
                            ? "Starts "
                            : "Started "}
                          {formatDistanceStrict(
                            new Date(
                              format(now, "yyyy-MM-dd") +
                                "T" +
                                period?.period_time?.start +
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
                                period?.period_time?.end +
                                "Z",
                            ),
                          )
                            ? "Ends "
                            : "Ended "}
                          {formatDistanceStrict(
                            new Date(
                              format(now, "yyyy-MM-dd") +
                                "T" +
                                period?.period_time?.end +
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
      </div>
    </main>
  );
}

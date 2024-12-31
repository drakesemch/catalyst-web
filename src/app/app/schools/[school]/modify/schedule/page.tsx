"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { api } from "@/trpc/react";
import { randomBytes } from "crypto";
import { Check, GripVertical, Loader, Plus, Save, Trash } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import type { RouterOutputs } from "@/server/api/root";
import { useState } from "react";
import { useParams } from "next/navigation";

type Period =
  RouterOutputs["catalyst"]["school"]["get"]["draft"]["periods"][number];
type Schedule =
  RouterOutputs["catalyst"]["school"]["get"]["draft"]["schedules"][number];

export default function SchedulesPage() {
  const { school: schoolId } = useParams<{ school: string }>();

  const utils = api.useUtils();
  const { data: periods } = api.catalyst.school.get.draft.periods.useQuery();
  const { data: schedules } =
    api.catalyst.school.get.draft.schedules.useQuery();
  const {
    mutate: save,
    isPending,
    isSuccess,
  } = api.catalyst.school.saveRaw.useMutation();

  const [hourOffset, setHourOffset] = useState(0);
  const [minuteOffset, setMinuteOffset] = useState(0);

  const applyOffset = () => {
    if (!periods || !schedules) return;

    const adjustTime = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const date = new Date();
      date.setHours((hours ?? 0) + hourOffset, (minutes ?? 0) + minuteOffset);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    const updatedSchedules = schedules.map((schedule) => ({
      ...schedule,
      periods: schedule.periods.map((period) => ({
        ...period,
        start: adjustTime(period.start),
        end: adjustTime(period.end),
      })),
    }));

    utils.catalyst.school.get.draft.schedules.setData(
      undefined,
      updatedSchedules,
    );
  };

  return (
    <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
      <div className="flex w-[min(100ch,100%)] flex-col gap-6">
        <div className="h1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1>Manage Schedules and Periods</h1>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                if (periods && schedules)
                  save({
                    periods: periods,
                    schedules: schedules,
                  });
              }}
              disabled={isPending}
            >
              {isSuccess ? (
                <>
                  <Check />
                  Saved
                </>
              ) : isPending ? (
                <>
                  <Loader className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
              type="number"
              value={hourOffset}
              onChange={(e) => setHourOffset(Number(e.target.value))}
              placeholder="Hour Offset"
            />
            <Input
              type="number"
              value={minuteOffset}
              onChange={(e) => setMinuteOffset(Number(e.target.value))}
              placeholder="Minute Offset"
            />
            <Button onClick={applyOffset}>Apply Offset</Button>
          </div>
          <h2>Periods</h2>
          <Reorder.Group
            axis="y"
            values={periods ?? []}
            onReorder={(newOrder) => {
              utils.catalyst.school.get.draft.periods.setData(
                undefined,
                newOrder,
              );
            }}
          >
            <div className="flex flex-col gap-2">
              {periods?.map((period) => (
                <PeriodItem key={period.id} period={period} periods={periods} />
              ))}
            </div>
          </Reorder.Group>
          <Button
            variant="outline"
            onClick={() => {
              const newPeriod = {
                id: randomBytes(20).toString("hex"),
                name: `Period ${(periods?.length ?? 0) + 1}`,
                periodName: `Period ${(periods?.length ?? 0) + 1}`,
                optionName: `Period ${(periods?.length ?? 0) + 1}`,
                type: "course" as const,
                periodOrder: (periods?.length ?? 0) + 1,
                optionOrder: 1,
                options: [],
                draftState: "saved" as const,
                schoolId: schoolId,
                periodId: randomBytes(20).toString("hex"),
                optionId: randomBytes(20).toString("hex"),
              };
              utils.catalyst.school.get.draft.periods.setData(undefined, [
                ...(periods ?? []),
                newPeriod,
              ]);
            }}
          >
            <Plus /> Add Period
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h2>Schedules</h2>
          <Reorder.Group
            axis="y"
            values={schedules ?? []}
            onReorder={(newOrder) => {
              utils.catalyst.school.get.draft.schedules.setData(
                undefined,
                newOrder,
              );
            }}
          >
            <div className="flex flex-col gap-8">
              {schedules?.map((schedule) => (
                <ScheduleItem
                  key={schedule.id}
                  schedule={schedule}
                  schedules={schedules}
                  periods={periods ?? []}
                />
              ))}
            </div>
          </Reorder.Group>
          <Button
            variant="outline"
            onClick={() => {
              if (!schedules) return;
              const newSchedule = {
                id: randomBytes(20).toString("hex"),
                name: `Schedule ${(schedules?.length ?? 0) + 1}`,
                periods: [],
                draftState: "saved" as const,
                schoolId: schoolId,
              };
              utils.catalyst.school.get.draft.schedules.setData(undefined, [
                ...schedules,
                newSchedule,
              ]);
            }}
          >
            <Plus /> Add Schedule
          </Button>
        </div>
      </div>
    </main>
  );
}

function PeriodItem({
  period,
  periods,
}: {
  period: Period;
  periods: Period[];
}) {
  const utils = api.useUtils();
  const controls = useDragControls();

  return (
    <Reorder.Item value={period} dragControls={controls}>
      <div className="flex gap-2">
        <div
          className="reorder-handle flex size-10 flex-shrink-0 items-center justify-start pl-4"
          onPointerDown={(evt) => {
            evt.preventDefault();
            controls.start(evt);
          }}
        >
          <GripVertical />
        </div>
        <Input
          className="flex-1"
          value={period.name}
          onChange={(e) => {
            utils.catalyst.school.get.draft.periods.setData(
              undefined,
              periods.map((p) =>
                p.id === period.id ? { ...p, name: e.target.value } : p,
              ),
            );
          }}
          placeholder="Period Name"
        />
        <Combobox
          className="flex-1"
          value={period.type}
          onSelect={(value) => {
            utils.catalyst.school.get.draft.periods.setData(
              undefined,
              periods.map((p) =>
                p.id === period.id
                  ? { ...p, type: value as "single" | "course" | "filler" }
                  : p,
              ),
            );
          }}
          groups={[
            {
              id: "period-types",
              header: "Period Types",
              values: [
                { id: "single", render: "Single Choice" },
                { id: "course", render: "Course" },
                { id: "filler", render: "Filler" },
              ],
            },
          ]}
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            utils.catalyst.school.get.draft.periods.setData(
              undefined,
              periods.filter((p) => p.id !== period.id),
            );
          }}
        >
          <Trash />
        </Button>
      </div>
    </Reorder.Item>
  );
}

function ScheduleItem({
  schedule,
  schedules,
  periods,
}: {
  schedule: Schedule;
  schedules: Schedule[];
  periods: Period[];
}) {
  const utils = api.useUtils();

  const controls = useDragControls();

  return (
    <Reorder.Item value={schedule} dragControls={controls}>
      <div className="flex gap-2">
        <div
          className="reorder-handle flex size-10 flex-shrink-0 items-center justify-start pl-4"
          onPointerDown={(evt) => {
            evt.preventDefault();
            controls.start(evt);
          }}
        >
          <GripVertical />
        </div>
        <Input
          className="flex-1"
          value={schedule.name}
          onChange={(e) => {
            utils.catalyst.school.get.draft.schedules.setData(
              undefined,
              schedules.map((s) =>
                s.id === schedule.id ? { ...s, name: e.target.value } : s,
              ),
            );
          }}
          placeholder="Schedule Name"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            utils.catalyst.school.get.draft.schedules.setData(
              undefined,
              schedules.filter((s) => s.id !== schedule.id),
            );
          }}
        >
          <Trash />
        </Button>
      </div>
      <Reorder.Group
        axis="y"
        values={schedule.periods}
        onReorder={(newPeriods) => {
          utils.catalyst.school.get.draft.schedules.setData(
            undefined,
            schedules.map((s) =>
              s.id === schedule.id ? { ...s, periods: newPeriods } : s,
            ),
          );
        }}
      >
        <div className="mt-2 flex flex-col gap-2 pl-8">
          {schedule.periods.map((period) => (
            <SchedulePeriodItem
              key={period.id}
              period={period}
              periods={periods}
              schedules={schedules}
              scheduleId={schedule.id}
            />
          ))}
        </div>
      </Reorder.Group>
      <Button
        variant="outline"
        className="mt-2 w-full"
        onClick={() => {
          const newPeriod = {
            id: randomBytes(20).toString("hex"),
            start: "",
            end: "",
          };
          utils.catalyst.school.get.draft.schedules.setData(
            undefined,
            schedules.map((s) =>
              s.id === schedule.id
                ? {
                    ...s,
                    periods: [
                      ...s.periods,
                      {
                        ...newPeriod,
                        schoolId: schedule.schoolId ?? "",
                        optionId: randomBytes(20).toString("hex"),
                        order: s.periods.length + 1,
                        scheduleId: schedule.id,
                      },
                    ],
                  }
                : s,
            ),
          );
        }}
      >
        <Plus /> Add Period
      </Button>
    </Reorder.Item>
  );
}

function SchedulePeriodItem({
  period,
  periods,
  schedules,
  scheduleId,
}: {
  period: Schedule["periods"][number];
  periods: Period[];
  schedules: Schedule[];
  scheduleId: string;
}) {
  const utils = api.useUtils();

  const controls = useDragControls();

  const convertToLocalTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const convertToUTCTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours ?? 0, minutes ?? 0);
    return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  };

  console.log(period);

  return (
    <Reorder.Item value={period} dragControls={controls}>
      <div className="flex gap-2">
        <div
          className="reorder-handle flex size-10 flex-shrink-0 items-center justify-start pl-4"
          onPointerDown={(evt) => {
            evt.preventDefault();
            controls.start(evt);
          }}
        >
          <GripVertical />
        </div>
        <Combobox
          className="flex-1"
          value={period.id}
          onSelect={(value) => {
            utils.catalyst.school.get.draft.schedules.setData(
              undefined,
              schedules.map((s) =>
                s.id === scheduleId
                  ? {
                      ...s,
                      periods: s.periods.map((p) =>
                        p.id === period.id ? { ...p, id: value } : p,
                      ),
                    }
                  : s,
              ),
            );
          }}
          groups={[
            {
              id: "filler",
              header: "Filler",
              values: periods
                .filter((period) => period.type == "filler")
                .map((period) => ({
                  id: period.id,
                  render: period.name,
                })),
            },
            {
              id: "courses",
              header: "Courses",
              values: periods
                .filter((period) => period.type == "course")
                .map((period) => ({
                  id: period.id,
                  render: period.name,
                })),
            },
            {
              id: "single",
              header: "Single Choice",
              values: periods
                .filter((period) => period.type == "single")
                .flatMap((period) =>
                  period.type == "single"
                    ? (period.options?.map((option) => ({
                        id: option.id,
                        render: (
                          <div className="flex flex-col gap-1">
                            <span>{option.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {period.name}
                            </span>
                          </div>
                        ),
                        selectionRender: (
                          <div className="flex flex-col gap-1">
                            {option.name} ({period.name})
                          </div>
                        ),
                      })) ?? [])
                    : [],
                ),
            },
          ]}
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            utils.catalyst.school.get.draft.schedules.setData(
              undefined,
              schedules.map((s) =>
                s.id === scheduleId
                  ? {
                      ...s,
                      periods: s.periods.filter((p) => p.id !== period.id),
                    }
                  : s,
              ),
            );
          }}
        >
          <Trash />
        </Button>
      </div>
      <div className="mt-2 flex gap-4 px-8">
        <Input
          className="flex-1"
          value={convertToLocalTime(period.start)}
          onChange={(e) => {
            utils.catalyst.school.get.draft.schedules.setData(
              undefined,
              schedules.map((s) =>
                s.id === scheduleId
                  ? {
                      ...s,
                      periods: s.periods.map((p) =>
                        p.id === period.id
                          ? { ...p, start: convertToUTCTime(e.target.value) }
                          : p,
                      ),
                    }
                  : s,
              ),
            );
          }}
          placeholder="Start Time"
        />
        <Input
          className="flex-1"
          value={convertToLocalTime(period.end)}
          onChange={(e) => {
            utils.catalyst.school.get.draft.schedules.setData(
              undefined,
              schedules.map((s) =>
                s.id === scheduleId
                  ? {
                      ...s,
                      periods: s.periods.map((p) =>
                        p.id === period.id
                          ? { ...p, end: convertToUTCTime(e.target.value) }
                          : p,
                      ),
                    }
                  : s,
              ),
            );
          }}
          placeholder="End Time"
        />
      </div>
    </Reorder.Item>
  );
}

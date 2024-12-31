"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import {
  CalendarDays,
  CalendarPlus,
  Check,
  Loader,
  Save,
  Trash,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function ModifyPage() {
  const { school: schoolId } = useParams<{ school: string }>();

  const utils = api.useUtils();

  const { data: scheduleDates } =
    api.catalyst.school.get.scheduleDates.get.useQuery({
      id: schoolId,
    });
  const {
    mutate: save,
    isPending,
    isSuccess,
  } = api.catalyst.school.get.scheduleDates.set.useMutation();
  const { data: schedules } = api.catalyst.school.get.saved.schedules.useQuery({
    id: schoolId,
  });

  return (
    <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
      <div className="flex w-[min(100ch,100%)] flex-col gap-6">
        <div className="h1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CalendarPlus />
            <div className="flex flex-col">
              <h1>Modify Schedule Dates</h1>
              <h2 className="text-lg font-medium text-muted-foreground">
                {scheduleDates?.length ?? 0} Dates
              </h2>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                utils.catalyst.school.get.scheduleDates.get.setData(
                  { id: schoolId },
                  (oldData) => [
                    ...(oldData ?? []),
                    {
                      id: Math.random().toString(),
                      date: new Date(),
                      scheduleId: schedules?.[0]?.schedule?.id ?? "",
                      draftState: "draft",
                      schoolId: schoolId,
                    },
                  ],
                );
              }}
            >
              <CalendarPlus />
              New Date
            </Button>
            <Button
              onClick={() =>
                save({
                  id: schoolId,
                  items: (scheduleDates ?? []).map((itm) => {
                    const d = itm.date;
                    d.setUTCHours(0, 0, 0, 0);
                    return {
                      id: itm.scheduleId,
                      date: d,
                    };
                  }),
                })
              }
              disabled={isPending}
            >
              {(() => {
                if (isSuccess) {
                  return (
                    <>
                      <Check />
                      Saved
                    </>
                  );
                } else if (isPending) {
                  return (
                    <>
                      <Loader className="animate-spin" />
                      Saving...
                    </>
                  );
                } else {
                  return (
                    <>
                      <Save />
                      Save
                    </>
                  );
                }
              })()}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {scheduleDates
            ?.sort((a, b) => (Number(a.date) >= Number(b.date) ? 1 : -1))
            ?.map((date) => {
              const d = new Date(
                date.date.getUTCFullYear(),
                date.date.getUTCMonth(),
                date.date.getUTCDate(),
              );
              console.log(d);
              return (
                <div
                  key={date.id}
                  className="flex items-center justify-start gap-4 border-b p-4"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[40ch] justify-start"
                      >
                        <CalendarDays /> {format(new Date(d), "MMMM do, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        selected={new Date(d)}
                        mode="single"
                        onSelect={(newDate?: Date) => {
                          utils.catalyst.school.get.scheduleDates.get.setData(
                            { id: schoolId },
                            (oldData) => {
                              if (!oldData) return oldData;
                              return oldData.map((d) => {
                                if (d.id === date.id) {
                                  return { ...d, date: newDate ?? new Date() };
                                }
                                return d;
                              });
                            },
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="ml-auto" />
                  <Select
                    value={date.scheduleId}
                    onValueChange={(newValue) => {
                      utils.catalyst.school.get.scheduleDates.get.setData(
                        { id: schoolId },
                        (oldData) => {
                          if (!oldData) return oldData;
                          return oldData.map((d) => {
                            if (d.id === date.id) {
                              return { ...d, scheduleId: newValue };
                            }
                            return d;
                          });
                        },
                      );
                    }}
                  >
                    <SelectTrigger className="w-[20ch]">
                      {schedules?.find(
                        (schedule) => schedule.schedule?.id == date.scheduleId,
                      )?.schedule?.name ?? "No Schedule"}
                    </SelectTrigger>
                    <SelectContent>
                      {schedules?.map((schedule) => (
                        <SelectItem
                          key={schedule.schedule?.id ?? ""}
                          value={schedule.schedule?.id ?? ""}
                        >
                          {schedule.schedule?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      utils.catalyst.school.get.scheduleDates.get.setData(
                        { id: schoolId },
                        (oldData) => {
                          if (!oldData) return oldData;
                          return oldData.filter((d) => d.id !== date.id);
                        },
                      );
                    }}
                  >
                    <Trash /> Delete
                  </Button>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}

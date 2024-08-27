"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { Reorder, useDragControls } from "framer-motion";
import { randomBytes } from "crypto";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Clock,
  GripVertical,
  Info,
  List,
  Loader,
  LogOut,
  MapPinPlus,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const states = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
} as const;

export default function OnboardingPage() {
  if (typeof window === "undefined") return null;
  const [user] = api.catalyst.user.get.useSuspenseQuery();
  const [settings] = api.catalyst.user.settings.get.useSuspenseQuery();
  const [schools] = api.catalyst.school.list.useSuspenseQuery();
  const { mutate, isPending } = api.catalyst.user.settings.draft.useMutation();

  function getKey(key: string) {
    return settings?.find((setting) => setting.key === key);
  }

  const fName = getKey("f_name")?.value ?? user?.name?.split(" ").at(0);
  const lName = getKey("l_name")?.value ?? user?.name?.split(" ").at(-1);
  const grade = getKey("grade")?.value;
  const schoolId = getKey("school_id")?.value;

  return (
    <main className="relative flex min-h-[100vh] w-full flex-col items-center justify-start gap-2 overflow-hidden">
      <div className="flex w-[min(100vw,100ch)] flex-col items-start justify-start gap-4 p-12">
        <div
          className="flex w-full animate-fade-in flex-col items-center justify-center gap-2 opacity-0 md:flex-row md:justify-between"
          style={{ animationDelay: "5000ms" }}
        >
          <div className="flex flex-row items-center gap-2">
            <Button href="/home" variant="outline" size="sm">
              <ArrowLeft /> Home
            </Button>
            <Button variant="outline" size="sm">
              <LogOut /> Sign Out
            </Button>
            <Button variant="destructive" size="sm">
              <Trash /> Delete Account
            </Button>
          </div>
          <div className="flex flex-row items-center gap-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {!isPending ? (
                <>Step 1 of 3</>
              ) : (
                <>
                  <Loader className="animate-spin" /> Saving as Draft
                </>
              )}
            </div>
            <Button size="sm" href="/onboarding/canvas">
              Continue <ArrowRight />
            </Button>
          </div>
        </div>
        <h1 className="flex flex-wrap gap-3 text-balance text-5xl font-bold md:text-6xl">
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            Hey
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "500ms" }}
          >
            there
          </span>
          <span className="inline-flex flex-wrap gap-3">
            <label
              className="ml-2 inline-flex animate-fade-in flex-col gap-2 opacity-0"
              style={{ animationDelay: "700ms" }}
            >
              <Input
                className="h-auto w-[8ch] px-4 py-2 text-3xl md:text-4xl"
                defaultValue={fName}
                maxLength={15}
                onChange={(evt) => {
                  mutate({
                    fName: evt.target.value,
                  });
                }}
                placeholder="Sheldon"
              />
              <span className="text-xs text-muted-foreground">
                First Name / Nickname
              </span>
            </label>
            <span className="inline-flex gap-3">
              <label
                className="ml-2 inline-flex animate-fade-in flex-col gap-2 opacity-0"
                style={{ animationDelay: "1000ms" }}
              >
                <Input
                  className="h-auto w-[min(12ch,70vw)] px-4 py-2 text-3xl md:text-4xl"
                  defaultValue={lName}
                  maxLength={30}
                  onChange={(evt) => {
                    mutate({
                      lName: evt.target.value,
                    });
                  }}
                  placeholder="Cooper"
                />
                <span className="text-xs text-muted-foreground">Last Name</span>
              </label>
              <span
                className="animate-fade-in opacity-0"
                style={{ animationDelay: "1300ms" }}
              >
                ,
              </span>
            </span>
          </span>
        </h1>
        <h2 className="flex max-w-full flex-wrap gap-2 text-3xl font-bold text-muted-foreground md:text-4xl">
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "1600ms" }}
          >
            Welcome
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "2000ms" }}
          >
            to
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "2200ms" }}
          >
            Catalyst!
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "2700ms" }}
          >
            You
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "2900ms" }}
          >
            are
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "3100ms" }}
          >
            in
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "3300ms" }}
          >
            grade
          </span>
          <span className="inline-flex flex-wrap gap-3">
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "3500ms" }}
            >
              <label className="relative ml-2 inline-flex flex-col gap-2">
                <Input
                  className="h-auto w-[5ch] px-4 py-2 text-xl md:text-2xl"
                  min={0}
                  max={12}
                  maxLength={2}
                  defaultValue={grade ?? ""}
                  onChange={(evt) => {
                    mutate({
                      grade: evt.target.value,
                    });
                  }}
                  type="number"
                />
                <span className="text-xs text-muted-foreground">Grade</span>
              </label>
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "3700ms" }}
            >
              ,
            </span>
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "3900ms" }}
          >
            at
          </span>
          <span className="inline-flex flex-wrap gap-3">
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "4200ms" }}
            >
              <label className="relative bottom-2 ml-2 inline-flex flex-col gap-2">
                <Combobox
                  emptyRender={<>No schools found</>}
                  placeholders={{
                    emptyValue: "Select a school...",
                    search: "Search for a school...",
                  }}
                  defaultValue={schoolId ?? undefined}
                  onSelect={(value) => {
                    mutate({
                      schoolId: value,
                    });
                  }}
                  className="h-auto w-[min(30ch,80vw)] px-4 py-2 text-xl md:text-2xl"
                  groups={[
                    {
                      id: "schools",
                      header: "",
                      values: schools.map((school) => ({
                        id: school.id,
                        render: school.name,
                      })),
                    },
                  ]}
                  afterRender={
                    <>
                      <Separator />
                      <div className="flex gap-2 p-2">
                        <p className="p-2 text-xs text-muted-foreground">
                          Can{"'"}t find your school?
                        </p>
                        <Suspense
                          fallback={
                            <Button
                              className="ml-auto h-auto text-xs"
                              variant="outline"
                            >
                              <MapPinPlus /> Add Your School
                            </Button>
                          }
                        >
                          <AddSchool />
                        </Suspense>
                      </div>
                    </>
                  }
                />
                <span className="text-xs text-muted-foreground">
                  School Name
                </span>
              </label>
            </span>
            <span
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "4400ms" }}
            >
              .
            </span>
          </span>
        </h2>
      </div>
    </main>
  );
}

type Period =
  | {
      id: string;
      name: string;
      type: "course" | "filler";
    }
  | {
      id: string;
      name: string;
      type: "single";
      options: PeriodOption[];
    };

type PeriodOption = {
  id: string;
  name: string;
};

type Schedule = {
  id: string;
  name: string;
  periods: {
    id: string;
    start: string;
    end: string;
  }[];
};

const debounceController = new Map();

function AddSchool() {
  const { mutate, isPending } = api.catalyst.school.draft.useMutation({
    onMutate: async (data) => {
      const [key, value] = [Object.keys(data).join(","), Math.random()];
      debounceController.set(key, value);
      await new Promise((res, rej) =>
        setTimeout(() => {
          debounceController.get(key) == value ? res(null) : rej(null);
        }, 3000),
      );
    },
  });
  const { mutate: saveToPending } = api.catalyst.school.save.useMutation();
  const [details] = api.catalyst.school.get.draft.details.useSuspenseQuery();
  const [defaultPeriods] =
    api.catalyst.school.get.draft.periods.useSuspenseQuery();
  const [defaultSchedules] =
    api.catalyst.school.get.draft.schedules.useSuspenseQuery();
  const [periods, setPeriods] = useState<Period[]>(
    (defaultPeriods as Period[]) ?? [],
  );
  const [schedules, setSchedules] = useState<Schedule[]>(
    (defaultSchedules as Schedule[]) ?? [],
  );

  useEffect(() => {
    if (periods.length == 0) return;
    mutate({
      periods,
    });
  }, [periods, mutate]);

  useEffect(() => {
    if (schedules.length == 0) return;
    mutate({
      schedules,
    });
  }, [schedules, mutate]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="ml-auto h-auto text-xs" variant="outline">
          <MapPinPlus /> Add Your School
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add School</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-auto p-4">
          <div className="flex items-center gap-2 font-bold">
            <Info /> General and Locational Information
          </div>
          <div className="flex gap-4">
            <label className="flex-1">
              <Input
                className="h-auto w-full px-4 py-2 text-sm"
                maxLength={32}
                defaultValue={details?.name ?? ""}
                onChange={(evt) => {
                  mutate({
                    name: evt.target.value,
                  });
                }}
                placeholder="East High School"
              />
              <span className="text-xs text-muted-foreground">School Name</span>
            </label>
            <label className="flex-1">
              <Input
                maxLength={32}
                className="h-auto w-full px-4 py-2 text-sm"
                defaultValue={details?.district ?? ""}
                onChange={(evt) => {
                  mutate({
                    district: evt.target.value,
                  });
                }}
                placeholder="Salt Lake City School District"
              />
              <span className="text-xs text-muted-foreground">
                School District
              </span>
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex-1">
              <Input
                className="h-auto w-full px-4 py-2 text-sm"
                defaultValue={details?.address ?? ""}
                onChange={(evt) => {
                  mutate({
                    address: evt.target.value,
                  });
                }}
                placeholder="840 S 1300 E"
              />
              <span className="text-xs text-muted-foreground">
                School Address
              </span>
            </label>
            <label className="flex-1">
              <Input
                className="h-auto w-full px-4 py-2 text-sm"
                defaultValue={details?.city ?? ""}
                onChange={(evt) => {
                  mutate({
                    city: evt.target.value,
                  });
                }}
                placeholder="Salt Lake City"
              />
              <span className="text-xs text-muted-foreground">City</span>
            </label>
            <label className="flex-1">
              <Combobox
                className="h-auto w-full px-4 py-2 text-sm"
                defaultValue={details?.state ?? undefined}
                onSelect={(value) => {
                  mutate({
                    state: value,
                  });
                }}
                groups={[
                  {
                    id: "states",
                    header: "States",
                    values: Object.entries(states).map(([id, render]) => ({
                      id,
                      render,
                    })),
                  },
                ]}
              />
              <span className="text-xs text-muted-foreground">State</span>
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex-1">
              <Input
                className="h-auto w-full px-4 py-2 text-sm"
                defaultValue={details?.canvasURL ?? ""}
                onChange={(evt) => {
                  mutate({
                    url: evt.target.value,
                  });
                }}
                placeholder="https://canvas.instructure.com"
              />
              <span className="text-xs text-muted-foreground">Canvas URL</span>
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2 font-bold">
            <Clock /> Scheduling Information
          </div>
          <div className="flex gap-4 [&>div]:flex-1">
            <div className="flex flex-col gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <List /> View and Add Periods
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Periods</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col gap-4 overflow-auto p-4">
                    {periods.length == 0 && (
                      <p className="py-8 text-center text-xs text-muted-foreground">
                        No periods added yet.
                      </p>
                    )}
                    {periods.length > 0 && (
                      <Reorder.Group
                        axis="y"
                        values={periods}
                        onReorder={setPeriods}
                        className="flex flex-col gap-4"
                      >
                        {periods.map((item) => (
                          <Period
                            key={item.id}
                            item={item}
                            setPeriods={setPeriods}
                          />
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                  <DrawerFooter className="flex flex-row gap-4 [&>button]:flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPeriods((periods) => [
                          ...periods,
                          {
                            id: randomBytes(20).toString("hex"),
                            name: `Period ${(periods.length ?? 0) + 1}`,
                            type: "course",
                          },
                        ]);
                      }}
                    >
                      Add Period <Plus />
                    </Button>
                    <DrawerClose asChild>
                      <Button size="sm">
                        Save <Save />
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <div className="text-xs text-muted-foreground">Periods</div>
            </div>
            <div className="flex flex-col gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <Clock /> View and Add Schedules
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Add Schedule</DrawerTitle>
                    <DrawerDescription>
                      Please enter start and end times in your current timezone.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-col gap-4 overflow-auto p-4">
                    {schedules.length == 0 && (
                      <p className="py-8 text-center text-xs text-muted-foreground">
                        No schedules added yet.
                      </p>
                    )}
                    {schedules.length > 0 && (
                      <Reorder.Group
                        axis="y"
                        values={schedules}
                        onReorder={setSchedules}
                        className="flex flex-col gap-4"
                      >
                        {schedules.map((item) => (
                          <Schedule
                            key={item.id}
                            periods={periods}
                            item={item}
                            setSchedules={setSchedules}
                          />
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                  <DrawerFooter className="flex flex-row gap-4 [&>button]:flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSchedules((schedules) => [
                          ...schedules,
                          {
                            id: randomBytes(20).toString("hex"),
                            name: `Schedule ${schedules.length + 1}`,
                            periods: [
                              {
                                id: randomBytes(20).toString("hex"),
                                start: "",
                                end: "",
                              },
                            ],
                          },
                        ]);
                      }}
                    >
                      Add Schedule <Plus />
                    </Button>
                    <DrawerClose asChild>
                      <Button size="sm">
                        Save <Save />
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <div className="text-xs text-muted-foreground">Schedules</div>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex flex-row items-center justify-end">
          <span className="mr-6 flex items-center gap-2 text-xs text-muted-foreground">
            {!isPending ? (
              <>
                <Save />
                Saved
              </>
            ) : (
              <>
                <Loader className="animate-spin" />
                Saving...
              </>
            )}
          </span>
          <DrawerClose asChild>
            <Button size="sm" variant="outline">
              Save as Draft
              <Save />
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button size="sm" onClick={() => saveToPending()}>
              Publish and Continue
              <Check />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Period({
  item,
  setPeriods,
}: {
  item: Period;
  setPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls}>
      <div className="flex flex-col gap-4 rounded border bg-background p-4">
        <div className="flex gap-2">
          <div
            className="reorder-handle flex size-10 flex-1 flex-shrink-0 items-center justify-start pl-4"
            onPointerDown={(evt) => {
              evt.preventDefault();
              controls.start(evt);
            }}
          >
            <GripVertical />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setPeriods((periods) => {
                const index = periods.findIndex(
                  (period) => period.id === item.id,
                );
                if (index === -1) return periods;
                if (index === 0) return periods;
                const newPeriods = [...periods];
                newPeriods.splice(index, 1);
                newPeriods.splice(index - 1, 0, item);
                return newPeriods;
              });
            }}
          >
            <ArrowUp />
            <span className="sr-only">Move Period Up</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setPeriods((periods) => {
                const index = periods.findIndex(
                  (period) => period.id === item.id,
                );
                if (index === -1) return periods;
                if (index === periods.length - 1) return periods;
                const newPeriods = [...periods];
                newPeriods.splice(index, 1);
                newPeriods.splice(index + 1, 0, item);
                return newPeriods;
              });
            }}
          >
            <ArrowDown />
            <span className="sr-only">Move Period Down</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setPeriods((periods) =>
                periods.filter((period) => period.id !== item.id),
              );
            }}
          >
            <Trash />
            <span className="sr-only">Delete Period</span>
          </Button>
        </div>
        <div className="flex gap-4">
          <label className="flex-1">
            <Input
              className="h-auto w-full px-4 py-2 text-sm"
              value={item.name}
              onChange={(e) => {
                setPeriods((periods) =>
                  periods.map((period) => {
                    if (period.id === item.id) {
                      return {
                        ...period,
                        name: e.target.value,
                      };
                    }
                    return period;
                  }),
                );
              }}
              placeholder="Period 1"
            />
            <span className="text-xs text-muted-foreground">Period Name</span>
          </label>
          <label className="flex-1">
            <Combobox
              className="h-auto w-full px-4 py-2 text-sm"
              value={item.type}
              onSelect={(value) => {
                setPeriods((periods) =>
                  periods.map((period) => {
                    if (period.id == item.id) {
                      if (period.type == "single") {
                        return {
                          ...period,
                          type: value as "single",
                          options: period.options ?? [],
                        };
                      }
                      return {
                        ...period,
                        type: value as "filler",
                      };
                    }
                    return period;
                  }),
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
            <span className="text-xs text-muted-foreground">Period Type</span>
          </label>
        </div>
        {item.type == "single" && (
          <>
            <h2 className="text-sm text-muted-foreground">Options</h2>
            {item.options?.length > 0 && (
              <Reorder.Group
                axis="y"
                values={item.options}
                onReorder={(options) => {
                  setPeriods((periods) =>
                    periods.map((period) => {
                      if (period.id === item.id) {
                        return {
                          ...period,
                          options,
                        };
                      }
                      return period;
                    }),
                  );
                }}
                className="flex flex-col gap-4"
              >
                {item.options?.map((option) => (
                  <PeriodOption
                    key={option.id}
                    period={item}
                    item={option}
                    setPeriods={setPeriods}
                  />
                ))}
              </Reorder.Group>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPeriods((periods) =>
                  periods.map((period) => {
                    if (period.id === item.id && period.type == "single") {
                      return {
                        ...period,
                        options: [
                          ...(period.options ?? []),
                          {
                            id: randomBytes(20).toString("hex"),
                            name: `Option ${(period.options?.length ?? 0) + 1}`,
                          },
                        ],
                      };
                    }
                    return period;
                  }),
                );
              }}
            >
              <Plus /> Add Option
            </Button>
          </>
        )}
      </div>
    </Reorder.Item>
  );
}

function PeriodOption({
  item,
  setPeriods,
}: {
  period: Period;
  item: PeriodOption;
  setPeriods: React.Dispatch<React.SetStateAction<Period[]>>;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item value={item} dragControls={controls}>
      <div className="flex flex-col gap-4 rounded border bg-background p-4">
        <div className="flex gap-2">
          <div
            className="reorder-handle flex size-10 flex-shrink-0 items-center justify-start pl-2"
            onPointerDown={(evt) => {
              evt.preventDefault();
              controls.start(evt);
            }}
          >
            <GripVertical />
          </div>
          <label className="flex-1">
            <Input
              className="h-auto w-full px-4 py-2 text-sm"
              value={item.name}
              onChange={(e) => {
                setPeriods((periods) =>
                  periods.map((period) => {
                    if (period.id === period.id && period.type == "single") {
                      return {
                        ...period,
                        options: period.options?.map((option) => {
                          if (option.id === item.id) {
                            return {
                              ...option,
                              name: e.target.value,
                            };
                          }
                          return option;
                        }),
                      };
                    }
                    return period;
                  }),
                );
              }}
              placeholder="Option 1"
            />
            <span className="text-xs text-muted-foreground">Option Name</span>
          </label>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setPeriods((periods) =>
                periods.map((period) => {
                  if (period.id === period.id && period.type === "single") {
                    const index = period.options?.findIndex(
                      (option) => option.id === item.id,
                    );
                    if (index === -1) return period;
                    if (index === 0) return period;
                    const newOptions = [...period.options];
                    newOptions.splice(index, 1);
                    newOptions.splice(index - 1, 0, item);
                    return {
                      ...period,
                      options: newOptions,
                    };
                  }
                  return period;
                }),
              );
            }}
          >
            <ArrowUp />
            <span className="sr-only">Move Option Up</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setPeriods((periods) =>
                periods.map((period) => {
                  if (period.id === period.id && period.type === "single") {
                    const index = period.options?.findIndex(
                      (option) => option.id === item.id,
                    );
                    if (index === -1) return period;
                    if (index === period.options.length - 1) return period;
                    const newOptions = [...period.options];
                    newOptions.splice(index, 1);
                    newOptions.splice(index + 1, 0, item);
                    return {
                      ...period,
                      options: newOptions,
                    };
                  }
                  return period;
                }),
              );
            }}
          >
            <ArrowDown />
            <span className="sr-only">Move Option Down</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setPeriods((periods) =>
                periods.map((period) => {
                  if (period.id === period.id && period.type === "single") {
                    return {
                      ...period,
                      options: period.options?.filter(
                        (option) => option.id !== item.id,
                      ),
                    };
                  }
                  return period;
                }),
              );
            }}
          >
            <Trash />
            <span className="sr-only">Delete Option</span>
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}

function Schedule({
  item,
  periods,
  setSchedules,
}: {
  item: Schedule;
  periods: Period[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={item} dragControls={controls}>
      <div className="flex flex-col gap-4 rounded border bg-background p-4">
        <div className="flex gap-2">
          <div
            className="reorder-handle flex size-10 flex-shrink-0 items-center justify-start pl-2"
            onPointerDown={(evt) => {
              evt.preventDefault();
              controls.start(evt);
            }}
          >
            <GripVertical />
          </div>
          <label className="flex-1">
            <Input
              className="h-auto w-full px-4 py-2 text-sm"
              value={item.name}
              onChange={(e) => {
                setSchedules((schedules) =>
                  schedules.map((schedule) => {
                    if (schedule.name === item.name) {
                      return {
                        ...schedule,
                        name: e.target.value,
                      };
                    }
                    return schedule;
                  }),
                );
              }}
              placeholder="Schedule 1"
            />
            <span className="text-xs text-muted-foreground">Schedule Name</span>
          </label>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSchedules((schedules) => {
                const index = schedules.findIndex(
                  (schedule) => schedule.name === item.name,
                );
                if (index === -1) return schedules;
                if (index === 0) return schedules;
                const newSchedules = [...schedules];
                newSchedules.splice(index, 1);
                newSchedules.splice(index - 1, 0, item);
                return newSchedules;
              });
            }}
          >
            <ArrowUp />
            <span className="sr-only">Move Schedule Up</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSchedules((schedules) => {
                const index = schedules.findIndex(
                  (schedule) => schedule.name === item.name,
                );
                if (index === -1) return schedules;
                if (index === schedules.length - 1) return schedules;
                const newSchedules = [...schedules];
                newSchedules.splice(index, 1);
                newSchedules.splice(index + 1, 0, item);
                return newSchedules;
              });
            }}
          >
            <ArrowDown />
            <span className="sr-only">Move Schedule Down</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setSchedules((schedules) =>
                schedules.filter((schedule) => schedule.name !== item.name),
              );
            }}
          >
            <Trash />
            <span className="sr-only">Delete Schedule</span>
          </Button>
        </div>
        {item.periods?.length == 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No periods added yet.
          </p>
        )}
        {item.periods?.length > 0 && (
          <Reorder.Group
            axis="y"
            values={item.periods}
            onReorder={(periods) => {
              setSchedules((schedules) =>
                schedules.map((schedule) => {
                  if (schedule.name === item.name) {
                    return {
                      ...schedule,
                      periods,
                    };
                  }
                  return schedule;
                }),
              );
            }}
            className="flex flex-col gap-4"
          >
            {item.periods.map((period) => (
              <AddedPeriod
                key={period.id}
                item={period}
                periods={periods}
                setSchedules={setSchedules}
              />
            ))}
          </Reorder.Group>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSchedules((schedules) =>
              schedules.map((schedule) => {
                if (schedule.name === item.name) {
                  return {
                    ...schedule,
                    periods: [
                      ...schedule.periods,
                      {
                        id: randomBytes(20).toString("hex"),
                        start: "",
                        end: "",
                      },
                    ],
                  };
                }
                return schedule;
              }),
            );
          }}
        >
          <Plus /> Add Period
        </Button>
      </div>
    </Reorder.Item>
  );
}

function AddedPeriod({
  item,
  periods,
  setSchedules,
}: {
  item: Schedule["periods"][0];
  periods: Period[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={item} dragControls={controls}>
      <div className="flex flex-col gap-4 rounded border bg-background p-4">
        <div className="flex gap-2">
          <div
            className="reorder-handle flex size-10 flex-shrink-0 items-center justify-start pl-2"
            onPointerDown={(evt) => {
              evt.preventDefault();
              controls.start(evt);
            }}
          >
            <GripVertical />
          </div>
          <label className="flex-1">
            <Combobox
              className="h-auto w-full px-4 py-2 text-sm"
              defaultValue={item.id ?? undefined}
              onSelect={(value) => {
                setSchedules((schedules) =>
                  schedules.map((schedule) => {
                    if (schedule.periods.includes(item)) {
                      return {
                        ...schedule,
                        periods: schedule.periods.map((period) => {
                          if (period == item) {
                            return {
                              ...period,
                              id: value,
                            };
                          }
                          return period;
                        }),
                      };
                    }
                    return schedule;
                  }),
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
                        ? period.options.map((option) => ({
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
                          }))
                        : [],
                    ),
                },
              ]}
            />
            <span className="text-xs text-muted-foreground">Name</span>
          </label>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSchedules((schedules) =>
                schedules.map((schedule) => {
                  if (schedule.periods.includes(item)) {
                    const index = schedule.periods.findIndex(
                      (period) => period === item,
                    );
                    if (index === -1) return schedule;
                    if (index === 0) return schedule;
                    const newPeriods = [...schedule.periods];
                    newPeriods.splice(index, 1);
                    newPeriods.splice(index - 1, 0, item);
                    return {
                      ...schedule,
                      periods: newPeriods,
                    };
                  }
                  return schedule;
                }),
              );
            }}
          >
            <ArrowUp />
            <span className="sr-only">Move Period Up</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSchedules((schedules) =>
                schedules.map((schedule) => {
                  if (schedule.periods.includes(item)) {
                    const index = schedule.periods.findIndex(
                      (period) => period === item,
                    );
                    if (index === -1) return schedule;
                    if (index === schedule.periods.length - 1) return schedule;
                    const newPeriods = [...schedule.periods];
                    newPeriods.splice(index, 1);
                    newPeriods.splice(index + 1, 0, item);
                    return {
                      ...schedule,
                      periods: newPeriods,
                    };
                  }
                  return schedule;
                }),
              );
            }}
          >
            <ArrowDown />
            <span className="sr-only">Move Period Down</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setSchedules((schedules) =>
                schedules.map((schedule) => {
                  if (schedule.periods.includes(item)) {
                    return {
                      ...schedule,
                      periods: schedule.periods.filter(
                        (period) => period !== item,
                      ),
                    };
                  }
                  return schedule;
                }),
              );
            }}
          >
            <Trash />
            <span className="sr-only">Delete Period</span>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <InputOTP
                maxLength={4}
                defaultValue={(() => {
                  let hr = parseInt(item.start.slice(0, 2));
                  const min = parseInt(item.start.slice(3, 5));
                  const utcOffset = new Date().getTimezoneOffset();
                  const offset = utcOffset / 60;
                  hr -= offset;

                  return Number.isNaN(hr) || Number.isNaN(min)
                    ? ""
                    : `${String(hr).padStart(2, "0")}${String(min).padStart(2, "0")}`;
                })()}
                onChange={(val) => {
                  let hr = parseInt(val.slice(0, 2));
                  const min = parseInt(val.slice(2, 4));
                  const utcOffset = new Date().getTimezoneOffset();
                  const offset = utcOffset / 60;
                  hr += offset;

                  setSchedules((schedules) =>
                    schedules.map((schedule) => {
                      if (schedule.periods.includes(item)) {
                        return {
                          ...schedule,
                          periods: schedule.periods.map((period) => {
                            if (period === item) {
                              return {
                                ...period,
                                start: `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
                              };
                            }
                            return period;
                          }),
                        };
                      }
                      return schedule;
                    }),
                  );
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <div>:</div>
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <span className="text-xs text-muted-foreground">Start Time</span>
          </label>
          <label className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <InputOTP
                maxLength={4}
                defaultValue={(() => {
                  let hr = parseInt(item.end.slice(0, 2));
                  const min = parseInt(item.end.slice(3, 5));
                  const utcOffset = new Date().getTimezoneOffset();
                  const offset = utcOffset / 60;
                  hr -= offset;

                  return Number.isNaN(hr) || Number.isNaN(min)
                    ? ""
                    : `${String(hr).padStart(2, "0")}${String(min).padStart(2, "0")}`;
                })()}
                onChange={(val) => {
                  let hr = parseInt(val.slice(0, 2));
                  const min = parseInt(val.slice(2, 4));
                  const utcOffset = new Date().getTimezoneOffset();
                  const offset = utcOffset / 60;
                  hr += offset;

                  setSchedules((schedules) =>
                    schedules.map((schedule) => {
                      if (schedule.periods.includes(item)) {
                        return {
                          ...schedule,
                          periods: schedule.periods.map((period) => {
                            if (period === item) {
                              return {
                                ...period,
                                end: `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
                              };
                            }
                            return period;
                          }),
                        };
                      }
                      return schedule;
                    }),
                  );
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <div>:</div>
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <span className="text-xs text-muted-foreground">End Time</span>
          </label>
        </div>
      </div>
    </Reorder.Item>
  );
}

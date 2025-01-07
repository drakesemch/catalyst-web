"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { api } from "@/trpc/react";
import { Combobox } from "@/components/ui/combobox";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ScheduleOnboardingPage() {
  const router = useRouter();
  const [settings] = api.catalyst.user.settings.get.useSuspenseQuery();
  const [periods] = api.catalyst.school.get.draft.periods.useSuspenseQuery({
    id: settings?.find((s) => s.key == "school_id")?.value ?? "",
  });
  const [values] = api.catalyst.user.schedule.values.get.useSuspenseQuery();
  const [{ pages }] =
    api.catalyst.user.canvas.courses.list.useSuspenseInfiniteQuery(
      {
        limit: 100,
        enrollment_state: "active",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const courses = useMemo(() => pages?.flatMap((page) => page.data), [pages]);

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
          classifications = Object.fromEntries(
            Object.entries(classifications).filter(
              ([_, clas]) => clas != "Not Available" && clas != undefined,
            ),
          );
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

  const { mutate, isPending } =
    api.catalyst.user.schedule.values.add.useMutation();
  const {
    mutate: finalize,
    isPending: isFinalizing,
    isSuccess: canRedirect,
  } = api.catalyst.user.settings.finalize.useMutation();

  return (
    <main className="relative flex min-h-[100vh] w-full flex-col items-center justify-start gap-2 overflow-hidden">
      <div className="flex w-[min(100vw,100ch)] flex-col items-start justify-start gap-4 p-12">
        <div
          className="flex w-full animate-fade-in flex-col items-center justify-center gap-2 opacity-0 md:flex-row md:justify-between"
          style={{ animationDelay: "3000ms" }}
        >
          <div className="flex flex-row items-center gap-2">
            <Button href="/onboarding/canvas" variant="outline" size="sm">
              <ArrowLeft /> Back to Step 2
            </Button>
          </div>
          <div className="flex flex-row items-center gap-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {(() => {
                if (isFinalizing) {
                  return (
                    <>
                      <Loader className="animate-spin" /> Saving
                    </>
                  );
                } else if (isPending) {
                  return (
                    <>
                      <Loader className="animate-spin" /> Saving as Draft
                    </>
                  );
                } else {
                  return <>Step 3 of 3</>;
                }
              })()}
            </div>
            <Button
              size="sm"
              onClick={async () => {
                finalize();
                await new Promise((resolve) => {
                  const checkInterval = setInterval(() => {
                    if (canRedirect) {
                      setTimeout(() => {
                        clearInterval(checkInterval);
                        resolve(null);
                      }, 100);
                    }
                  }, 100);
                });
                router.push("/app");
              }}
            >
              Finish <ArrowRight />
            </Button>
          </div>
        </div>
        <h1 className="flex flex-wrap gap-3 text-balance text-5xl font-bold md:text-6xl">
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            Let{"'"}s
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "500ms" }}
          >
            finish
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "700ms" }}
          >
            with
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "900ms" }}
          >
            your
          </span>
          <span
            className="animate-fade-in opacity-0"
            style={{ animationDelay: "1100ms" }}
          >
            schedule!
          </span>
        </h1>
        <div
          className="mt-2 flex w-full animate-fade-in flex-col gap-4 opacity-0"
          style={{ animationDelay: "1400ms" }}
        >
          {periods?.map(
            (period) =>
              period && (
                <div
                  key={period.id}
                  className="flex w-full items-center gap-2 rounded border p-4"
                >
                  <h2 className="text-lg font-bold">{period.name}</h2>
                  {(() => {
                    switch (period.type) {
                      case "filler":
                        return (
                          <span className="ml-auto text-xs text-muted-foreground">
                            No Selectable Options
                          </span>
                        );
                      case "single":
                        return (
                          <Combobox
                            className="ml-auto max-w-[20rem] flex-1"
                            onSelect={(valueId) => {
                              mutate({
                                periodId: period.id,
                                value: valueId,
                              });
                            }}
                            defaultValue={
                              values?.find(
                                (value) => value.periodId == period.id,
                              )?.value
                            }
                            groups={[
                              {
                                id: period.id,
                                header: "",
                                values: period.options!.map((value) => ({
                                  id: value.id,
                                  render: value.name,
                                })),
                              },
                            ]}
                          />
                        );
                      case "course":
                        return (
                          <Combobox
                            className="ml-auto max-w-[20rem] flex-1"
                            placeholders={{
                              emptyValue: "Select a course",
                              search: "Search for a course",
                            }}
                            onSelect={(courseId) => {
                              mutate({
                                periodId: period.id,
                                value: courseId,
                              });
                            }}
                            defaultValue={
                              values?.find(
                                (value) => value.periodId == period.id,
                              )?.value
                            }
                            groups={[
                              {
                                id: period.id,
                                header: "",
                                values:
                                  pages
                                    ?.map((page) =>
                                      page.data.map((course) => ({
                                        id: String(course.id),
                                        render: (
                                          <div className="flex flex-col gap-2 overflow-hidden">
                                            <span className="font-bold">
                                              {classifications[course.id] ??
                                                "No Classification"}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                              {course.original_name}
                                            </span>
                                          </div>
                                        ),
                                        selectionRender: (
                                          <div className="flex flex-col gap-2 truncate">
                                            {classifications[course.id] ??
                                              "No Classification"}{" "}
                                            ({course.original_name})
                                          </div>
                                        ),
                                      })),
                                    )
                                    .flat() ?? [],
                              },
                            ]}
                          />
                        );
                    }
                  })()}
                </div>
              ),
          )}
        </div>
      </div>
    </main>
  );
}

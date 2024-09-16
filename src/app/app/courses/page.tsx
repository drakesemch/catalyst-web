import { PercentageChart } from "@/components/catalyst/app/percentage-chart";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { CircleAlert } from "lucide-react";

export default async function coursePage() {
  const { data: courses } = await api.catalyst.user.canvas.courses.list({
    enrollment_state: "active",
    include: ["total_scores"],
  });
  return (
    <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
      <h1 className="h1">Active Course List</h1>
      {courses.map((course) => {
        return (
          <div key={course.id} className="flex w-full flex-col rounded border">
            <div className="flex items-stretch">
              <Button
                variant="outline"
                className="h-auto flex-1 overflow-hidden rounded-none hover:bg-secondary/70"
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
                variant="ghost"
                className="aspect-square h-auto flex-shrink-0 rounded-none border-l hover:bg-secondary/70"
                href={`/app/courses/${course.id}/grades`}
              >
                <PercentageChart
                  pct={course.enrollments?.at(0)?.computed_current_score ?? -1}
                  className="pointer-events-none"
                />
              </Button>
            </div>
            {course.data.missingAssignments > 0 && (
              <div className="flex items-center justify-start gap-2 border-t px-4 py-2 text-xs text-red-500">
                <CircleAlert />
                <span>
                  {course.data.missingAssignments} missing assignment
                  {course.data.missingAssignments != 1 && "s"}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
}

import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { PercentageChart } from "@/components/catalyst/app/percentage-chart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyState, submissionTypeWithIcon } from "@/lib/utils";
import { api } from "@/trpc/server";
import {
  Album,
  Plus,
  Percent,
  Undo,
  Pencil,
  Slash,
  Minus,
  ChevronRight,
} from "lucide-react";

export default async function GradesPage({
  params: { course },
}: {
  params: { course: string };
}) {
  const courseDetails = await api.catalyst.user.canvas.courses.get({
    courseId: Number(course),
  });

  const grades = await api.canvas.courses.get.grades({
    courseId: Number(course),
  });

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 lg:flex-row">
      <aside className="relative flex h-[calc((100vh-4.5rem-1px))] w-auto flex-shrink-0 flex-col gap-2 border-r p-4 lg:sticky lg:top-[calc(4.5rem)] lg:h-[calc((100vh-4.5rem-1px))] lg:w-[35ch]">
        <Button
          className="h-auto w-full gap-4"
          variant="outline"
          href={`/app/courses/${course}`}
        >
          <Album className="text-lg" />
          <div className="flex max-w-full flex-1 flex-shrink flex-col items-start gap-1 overflow-hidden">
            <span className="h3">{courseDetails?.classification}</span>
            <span className="max-w-full truncate text-xs text-muted-foreground">
              {courseDetails?.original_name}
            </span>
          </div>
          <ChevronRight />
        </Button>
        <Tabs defaultValue="assignment" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="assignment">
              <Percent /> Grades
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="course"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]]:h-full'
          >
            <CourseSidebar course={course} />
          </TabsContent>
          <TabsContent
            value="assignment"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]>div]:h-full [&[data-state="active"]]:h-full'
          >
            <h1 className="h3">Grades</h1>
            <div className="mt-2 flex flex-col gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <PercentageChart
                  pct={
                    courseDetails?.enrollments?.at(0)?.computed_current_score ??
                    -1
                  }
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    {courseDetails?.enrollments?.at(0)
                      ?.computed_current_score ?? "N/A"}
                    %
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
      <main className="flex-shrink-1 flex max-w-[100ch] flex-1 flex-col gap-2 px-8 py-4">
        <div className="sticky top-[1.5rem] z-10 -mx-4 flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 md:top-[calc((4.5rem+1px)+1.5rem)]">
          <div className="flex-1 px-2">Name</div>
          <div className="w-[10ch] px-2 text-right">score</div>
          <div className="w-[2ch]" />
          <div className="w-[10ch] px-2 text-right">out of</div>
          <div className="w-2" />
          <div className="w-10" />
        </div>
        <div className="sticky top-0 -mt-8 h-8 w-full bg-background md:top-[4.5rem]" />
        <div className="mt-1 flex flex-col">
          {grades.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col items-stretch gap-2 border-b py-2 md:flex-row"
            >
              <Button
                variant="ghost"
                className="flex h-auto flex-1 flex-col items-start gap-1 overflow-hidden"
                href={`/app/courses/${course}/assignments/${assignment.id}`}
              >
                <div className="max-w-full truncate font-bold">
                  {assignment.name}
                </div>
                <div>
                  {"submission_types" in assignment &&
                    assignment?.submission_types && (
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {prettyState(
                            assignment.submission?.workflow_state ??
                              "unsubmitted",
                          )}
                        </span>
                        <Minus />
                        {assignment?.submission_types.map((type) => (
                          <span className="flex items-center gap-1" key={type}>
                            {submissionTypeWithIcon(type)}
                          </span>
                        ))}
                      </span>
                    )}
                </div>
              </Button>
              <div className="flex h-full items-center justify-end gap-2">
                <Button
                  className="h-auto w-[10ch] justify-end text-right"
                  variant="ghost"
                >
                  {assignment.submission?.score ?? "N/A"}
                </Button>
                <div className="grid w-[2ch] place-items-center text-right text-muted-foreground">
                  <Slash />
                </div>
                <Button
                  className="h-auto w-[10ch] justify-end text-right"
                  variant="ghost"
                >
                  {assignment.points_possible ?? 0}
                </Button>
                <div className="w-2" />
                <div className="grid w-10 place-items-center">
                  <Button variant="outline" size="icon">
                    <Pencil />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

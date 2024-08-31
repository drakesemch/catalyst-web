import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyState, submissionTypeWithIcon } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Album, Plus, Percent, Undo, Pencil, Slash, Minus } from "lucide-react";

export default async function GradesPage({
  params: { course },
}: {
  params: { course: string };
}) {
  const grades = await api.canvas.courses.get.grades({
    courseId: Number(course),
  });

  return (
    <div className="mx-auto flex w-full max-w-full flex-col justify-center gap-2 p-2 lg:flex-row">
      <aside className="relative h-[calc((100vh-4.5rem-1px)-2rem)] w-auto flex-shrink-0 rounded-lg border p-4 lg:sticky lg:top-[calc(4.5rem+0.5rem)] lg:h-[calc((100vh-4.5rem-1px)-1rem)] lg:w-[35ch]">
        <Tabs defaultValue="grades" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="grades">
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
            value="grades"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]>div]:h-full [&[data-state="active"]]:h-full'
          >
            <h1 className="h1">Grades</h1>
            <div className="mt-auto flex flex-col gap-2">
              <Button variant="outline">
                <Undo /> Undo What-Ifs
              </Button>
              <Button>
                <Plus /> New Graded Item
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
      <main className="mx-auto w-[min(100ch,100%)] flex-shrink px-8 py-4 md:mx-0">
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
              className="flex items-stretch gap-2 border-b py-2"
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
                {assignment.points_possible}
              </Button>
              <div className="w-2" />
              <div className="grid w-10 place-items-center">
                <Button variant="outline" size="icon">
                  <Pencil />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyBody } from "@/lib/utils";
import { api } from "@/trpc/server";
import { format, formatDistanceStrict } from "date-fns";
import {
  Album,
  ArrowLeft,
  Calendar as CalendarIcon,
  Edit,
  Eye,
  Info,
  NotepadText,
  Plus,
  Save,
  Sparkles,
  Timer,
  Undo,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Separator } from "@/components/ui/separator";

export default async function AssignmentPage({
  params: { course, assignment },
}: {
  params: { course: string; assignment: string };
}) {
  const assignmentDetails = await api.canvas.courses.get.assignments.get({
    courseId: Number(course),
    assignmentId: Number(assignment),
  });

  const now = new Date();

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 p-2 lg:flex-row">
      <aside className="relative h-[calc((100vh-4.5rem-1px)-2rem)] w-auto flex-shrink-0 rounded-lg border p-4 lg:sticky lg:top-[calc(4.5rem+0.5rem)] lg:h-[calc((100vh-4.5rem-1px)-1rem)] lg:w-[35ch]">
        <Tabs defaultValue="assignment" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="assignment">
              <NotepadText /> Assignment
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
            <h1 className="h3">{assignmentDetails?.name}</h1>
            <div className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarIcon />
                {assignmentDetails.due_at
                  ? format(
                      assignmentDetails.due_at ?? "",
                      "EEE, MMM dd 'at' hh:mm a",
                    )
                  : "No Due Date Set"}
                <div className="ml-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit /> Edit
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="flex w-max max-w-full items-stretch p-0"
                      side="right"
                      align="start"
                    >
                      <div className="flex flex-col gap-2 border-r p-2">
                        <span className="-mx-2 -mt-2 w-[calc(100%+1rem)] border-b px-4 py-2 font-bold">
                          Modify Due Date
                        </span>
                        <span className="flex max-w-[30ch] items-center gap-2 text-xs text-muted-foreground">
                          <Info className="flex-shrink-0" /> Editing the date,
                          will change the due date for you, and will suggest
                          this date to other users.
                        </span>
                        <div className="mt-auto" />
                        <Button variant="outline">
                          <Sparkles />{" "}
                          <span>
                            Aug 29<sup>th</sup>
                          </span>
                        </Button>
                        <Separator className="-mx-2 w-[calc(100%+1rem)]" />
                        <Button variant="outline">
                          <Undo /> Revert
                        </Button>
                        <Button>
                          <Save /> Save Changes
                        </Button>
                      </div>
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
              </span>
              <span className="flex items-center gap-2">
                <Timer />
                {assignmentDetails?.due_at
                  ? formatDistanceStrict(assignmentDetails.due_at ?? "", now, {
                      addSuffix: true,
                    })
                  : "Sometime in the future"}
              </span>
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <Button variant="outline">
                <Eye /> View Submissions
              </Button>
              <Button>
                <Plus /> New Submission
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
      <main className="flex-shrink-1 flex max-w-[100ch] flex-1 flex-col gap-2 p-4">
        <Button
          variant="outline"
          size="sm"
          href={`/app/courses/${course}/modules`}
          className="w-min"
        >
          <ArrowLeft /> View all Modules
        </Button>
        {assignmentDetails?.description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: prettyBody(assignmentDetails?.description),
            }}
            className="render-fancy render-white-content mb-24 w-full lg:mb-0"
          />
        ) : (
          <p className="mb-24 w-full text-xs text-muted-foreground lg:mb-0">
            No description provided.
          </p>
        )}
      </main>
    </div>
  );
}

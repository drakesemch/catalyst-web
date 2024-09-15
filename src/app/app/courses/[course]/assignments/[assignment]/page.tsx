import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyBody, prettyState, submissionTypeWithIcon } from "@/lib/utils";
import { api } from "@/trpc/server";
import { format, formatDistanceStrict } from "date-fns";
import {
  Album,
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronRight,
  Edit,
  Eye,
  Info,
  NotepadText,
  Plus,
  Save,
  Sparkles,
  SquareArrowOutUpRight,
  Timer,
  Undo,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { NewSubmission, SubmissionButtons, Submissions } from "./submission";
import { PercentageChart } from "@/components/catalyst/app/percentage-chart";

export default async function AssignmentPage({
  params: { course, assignment },
}: {
  params: { course: string; assignment: string };
}) {
  const courseDetails = await api.catalyst.user.canvas.courses.get({
    courseId: Number(course),
  });

  const assignmentDetails = await api.canvas.courses.get.assignments.get({
    courseId: Number(course),
    assignmentId: Number(assignment),
  });

  const now = new Date();

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
            <div className="mt-2 flex flex-col gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <PercentageChart
                  pct={
                    ((assignmentDetails.submission?.score ?? 0) /
                      assignmentDetails.points_possible) *
                    100
                  }
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    {assignmentDetails.submission?.score ?? "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {assignmentDetails.points_possible ?? "0"} pts possible
                  </span>
                </div>
              </div>
              <span className="font-bold">Score Statistics:</span>
              <div className="relative my-2 h-4 w-full">
                <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-muted" />
                <div
                  className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted-foreground"
                  style={{
                    left: `${((assignmentDetails.score_statistics?.min ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%`,
                    width: `${(((assignmentDetails.score_statistics?.max ?? 0) - (assignmentDetails.score_statistics?.min ?? 0)) / (assignmentDetails.points_possible ?? 1)) * 100}%`,
                  }}
                />
                <div
                  className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted-foreground"
                  style={{
                    left: `${((assignmentDetails.score_statistics?.lower_q ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%`,
                    width: `calc(${(((assignmentDetails.score_statistics?.median ?? 0) - (assignmentDetails.score_statistics?.lower_q ?? 0)) / (assignmentDetails.points_possible ?? 1)) * 100}% - 1px)`,
                  }}
                />
                <div
                  className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted-foreground"
                  style={{
                    left: `calc(${((assignmentDetails.score_statistics?.median ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}% + 1px)`,
                    width: `calc(${(((assignmentDetails.score_statistics?.upper_q ?? 0) - (assignmentDetails.score_statistics?.median ?? 0)) / (assignmentDetails.points_possible ?? 1)) * 100}% - 1px)`,
                  }}
                />
                <div
                  className="absolute top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-foreground text-left"
                  style={{
                    left: `${((assignmentDetails.submission?.score ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%`,
                  }}
                />
                <span
                  className="absolute left-0 top-full w-[5ch] text-left"
                  style={{
                    left: `min(${((assignmentDetails.score_statistics?.min ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                  }}
                >
                  {assignmentDetails.score_statistics?.min ?? 0}
                </span>
                <span
                  className="absolute bottom-full left-0 w-[5ch] text-left"
                  style={{
                    left: `min(${((assignmentDetails.score_statistics?.lower_q ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                  }}
                >
                  {assignmentDetails.score_statistics?.lower_q ?? 0}
                </span>
                <span
                  className="absolute left-0 top-full w-[5ch] text-center"
                  style={{
                    left: `min(${((assignmentDetails.score_statistics?.median ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                  }}
                >
                  {assignmentDetails.score_statistics?.median ?? 0}
                </span>
                <span
                  className="absolute bottom-full left-0 w-[5ch] text-right"
                  style={{
                    left: `min(${((assignmentDetails.score_statistics?.upper_q ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                  }}
                >
                  {assignmentDetails.score_statistics?.upper_q ?? 0}
                </span>
                <span
                  className="absolute left-0 top-full w-[5ch] text-right"
                  style={{
                    left: `min(${((assignmentDetails.score_statistics?.max ?? 0) / (assignmentDetails.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                  }}
                >
                  {assignmentDetails.score_statistics?.max ?? 0}
                </span>
              </div>
              <span className="flex h-4 items-center gap-2">
                {prettyState(
                  assignmentDetails.submission?.workflow_state ?? "unsubmitted",
                )}
              </span>
              <span className="flex h-4 items-center gap-2">
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
                        <span className="flex max-w-[30ch] items-center gap-2 text-xs text-muted-foreground">
                          <Info className="flex-shrink-0" /> Please enter the
                          time in 24-hour format in your local timezone.
                        </span>
                        <div className="mt-auto" />
                        <Button variant="outline">
                          <Sparkles />{" "}
                          <span>
                            Aug 29<sup>th</sup> at 3:00pm
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
                      <div>
                        <Calendar mode="single" />
                        <div className="flex justify-center border-t p-4">
                          <InputOTP maxLength={4}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <span>:</span>
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </span>
              <span className="flex items-center gap-2">
                <Timer />
                Due{" "}
                {assignmentDetails?.due_at
                  ? formatDistanceStrict(assignmentDetails.due_at ?? "", now, {
                      addSuffix: true,
                    })
                  : "Sometime in the future"}
              </span>
              <div className="flex flex-col gap-2">
                <b>Submitting: </b>
                {assignmentDetails.submission_types.map((type) => (
                  <span className="ml-2 flex items-center gap-2" key={type}>
                    {submissionTypeWithIcon(type)}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <SubmissionButtons
                course={course}
                assignment={assignment}
                assignmentDetails={assignmentDetails}
              />
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

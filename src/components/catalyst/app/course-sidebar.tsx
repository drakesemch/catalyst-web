import { CourseClassification } from "@/app/app/courses/[course]/client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import {
  Album,
  ChevronRight,
  FileText,
  UsersRound,
  Percent,
  // ListCheck,
  // MessageCircle,
} from "lucide-react";

export async function CourseSidebar({ course }: { course: string }) {
  const courseDetails = await api.catalyst.user.canvas.courses.get({
    courseId: Number(course),
  });

  const people = await api.canvas.courses.get.people({
    courseId: Number(course),
  });

  if (!courseDetails) {
    return <>NO COURSE ERROR!</>;
  }

  return (
    <>
      <Button
        className="h-auto w-full gap-4"
        variant="outline"
        href={`/app/courses/${course}`}
      >
        <Album className="text-lg" />
        <div className="flex max-w-full flex-1 flex-shrink flex-col items-start gap-1 overflow-hidden">
          <span className="h3">
            <CourseClassification id={Number(course)} />
          </span>
          <span className="max-w-full truncate text-xs text-muted-foreground">
            {courseDetails.original_name}
          </span>
        </div>
        <ChevronRight />
      </Button>
      <Button
        className="h-auto w-full gap-4"
        variant="outline"
        href={`/app/courses/${course}/modules`}
      >
        <FileText className="text-lg" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Modules</span>
          <span className="text-xs text-muted-foreground">
            {courseDetails.data.missingAssignments} Missing Assignments
          </span>
        </div>
        <ChevronRight />
      </Button>
      <Button
        className="h-auto w-full gap-4"
        variant="outline"
        href={`/app/courses/${course}/people`}
      >
        <UsersRound className="text-lg" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">People</span>
          <span className="text-xs text-muted-foreground">
            {
              people.filter((person) =>
                person.enrollments.some(
                  (enrollment) => enrollment.type == "StudentEnrollment",
                ),
              ).length
            }{" "}
            Students
          </span>
        </div>
        <ChevronRight />
      </Button>
      <Button
        className="h-auto w-full gap-4"
        variant="outline"
        href={`/app/courses/${course}/grades`}
      >
        <Percent className="text-lg" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Grades</span>
          <span className="text-xs text-muted-foreground">
            {courseDetails?.enrollments?.at(0)?.computed_current_score ?? "N/A"}
            %
          </span>
        </div>
        <ChevronRight />
      </Button>
      {/* <Button
        className="h-auto w-full gap-4"
        variant="outline"
        href={`/app/courses/${course}/todo`}
      >
        <ListCheck className="text-lg" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Todo Items</span>
          <span className="text-xs text-muted-foreground">
            3 Items Due Soon
          </span>
        </div>
        <ChevronRight />
      </Button>
      <Button
        className="h-auto w-full gap-4"
        variant="outline"
        href={`/app/courses/${course}/feedback`}
      >
        <MessageCircle className="text-lg" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="font-bold">Recent Feedback</span>
          <span className="text-xs text-muted-foreground">2 Scores added</span>
        </div>
        <ChevronRight />
      </Button> */}
    </>
  );
}

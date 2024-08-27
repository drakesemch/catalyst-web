import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import {
  Album,
  ChevronRight,
  FileText,
  UsersRound,
  Percent,
  ListCheck,
  MessageCircle,
} from "lucide-react";

export async function CourseSidebar({ course }: { course: string }) {
  const courseDetails = await api.catalyst.user.canvas.courses.get({
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
          <span className="h3">{courseDetails.classification}</span>
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
          <span className="text-xs text-muted-foreground">24 Students</span>
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
            1 Missing Assignment
          </span>
        </div>
        <ChevronRight />
      </Button>
      <Button
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
      </Button>
    </>
  );
}

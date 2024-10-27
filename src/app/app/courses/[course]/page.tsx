import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyBody } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Album, ChevronRight, Info } from "lucide-react";

export default async function CourseHomePage(
  props: {
    params: Promise<{ course: string }>;
  }
) {
  const params = await props.params;

  const {
    course
  } = params;

  const courseDetails = await api.catalyst.user.canvas.courses.get({
    courseId: Number(course),
  });
  const page = await api.canvas.courses.get.frontPage({
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
        <Tabs defaultValue="course" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info /> Info
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
            idk
          </TabsContent>
        </Tabs>
      </aside>
      <main
        dangerouslySetInnerHTML={{ __html: prettyBody(page.body) }}
        className="render-fancy render-white-content mx-auto max-w-[min(100ch,100%)] p-4 overflow-auto"
      />
    </div>
  );
}

import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyBody } from "@/lib/utils";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { Album, FileText, Plus, Calendar } from "lucide-react";

export default async function CourseHomePage(
  props: {
    params: Promise<{ course: string; page: string }>;
  }
) {
  const params = await props.params;

  const {
    course,
    page
  } = params;

  const pageDetail = await api.canvas.courses.get.pages.get({
    courseId: Number(course),
    pageId: page,
  });
  if (!pageDetail.created_at) {
    return <>ERROR</>;
  }
  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 p-2 lg:flex-row">
      <aside className="relative h-[calc((100vh-4.5rem-1px)-2rem)] w-auto flex-shrink-0 rounded-lg border p-4 lg:sticky lg:top-[calc(4.5rem+0.5rem)] lg:h-[calc((100vh-4.5rem-1px)-1rem)] lg:w-[35ch]">
        <Tabs defaultValue="page" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="page">
              <FileText /> Info
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="course"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]]:h-full'
          >
            <CourseSidebar course={course} />
          </TabsContent>
          <TabsContent
            value="page"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]>div]:h-full [&[data-state="active"]]:h-full'
          >
            <h1 className="h1">{pageDetail.title}</h1>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar /> Created{" "}
              {format(
                new Date(pageDetail.created_at),
                "MMMM dd, yyyy 'at' h:mm a",
              )}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar /> Updated{" "}
              {format(
                new Date(pageDetail.updated_at),
                "MMMM dd, yyyy 'at' h:mm a",
              )}
            </span>
            <div className="mt-auto flex flex-col gap-2">
              <Button>
                <Plus /> New Todo Item
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
      <main
        dangerouslySetInnerHTML={{ __html: prettyBody(pageDetail.body) }}
        className="render-fancy render-white-content mx-auto max-w-[min(100ch,100%)] p-4 overflow-auto"
      />
    </div>
  );
}

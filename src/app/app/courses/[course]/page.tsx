import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyBody } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Album, FileText } from "lucide-react";

export default async function CourseHomePage({
  params: { course },
}: {
  params: { course: string };
}) {
  const page = await api.canvas.courses.get.frontPage({
    courseId: Number(course),
  });
  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 p-2 lg:flex-row">
      <aside className="relative h-[calc((100vh-4.5rem-1px)-2rem)] w-auto flex-shrink-0 rounded-lg border p-4 lg:sticky lg:top-[calc(4.5rem+0.5rem)] lg:h-[calc((100vh-4.5rem-1px)-1rem)] lg:w-[35ch]">
        <Tabs defaultValue="assignment" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="assignment">
              <FileText /> Assignment
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
        className="render-fancy render-white-content mx-auto max-w-[100ch] flex-1 flex-shrink p-4"
      />
    </div>
  );
}

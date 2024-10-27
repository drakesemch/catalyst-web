import { HydrateClient, api } from "@/trpc/server";
import ModulesPage from "./client";
import { Suspense } from "react";
import {
  Album,
  ChevronRight,
  FileText,
  Plus,
  Search,
  SortDesc,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Button } from "@/components/ui/button";

export default async function ModulePreRender(
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
  await api.canvas.courses.get.modules.get
    .prefetch({
      courseId: Number(course),
    })
    .catch(console.error);
  await api.canvas.courses.get.assignments.list
    .prefetch({
      courseId: Number(course),
    })
    .catch(console.error);

  return (
    <HydrateClient>
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
          <Tabs defaultValue="modules" className="h-full">
            <TabsList className="w-full">
              <TabsTrigger value="course">
                <Album /> Course
              </TabsTrigger>
              <TabsTrigger value="modules">
                <FileText /> Modules
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="course"
              className='flex max-h-full flex-col gap-2 [&[data-state="active"]]:h-full'
            >
              <CourseSidebar course={course} />
            </TabsContent>
            <TabsContent
              value="modules"
              className='flex max-h-full flex-col gap-2 [&[data-state="active"]>div]:h-full [&[data-state="active"]]:h-full'
            >
              <h1 className="h1">Modules</h1>
              <div className="flex items-center gap-2 rounded border px-3 py-2 [&:has(input:focus-visible)]:outline">
                <Search />
                <input
                  type="search"
                  placeholder="Search modules..."
                  className="flex-1 bg-background outline-none"
                />
              </div>
              <Button variant="outline" className="w-full justify-start">
                <SortDesc /> Sort and Filters
              </Button>
              <div className="mt-auto flex flex-col gap-2">
                <Button>
                  <Plus /> New Todo Item
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
        <Suspense>
          <ModulesPage params={params} />
        </Suspense>
      </div>
    </HydrateClient>
  );
}

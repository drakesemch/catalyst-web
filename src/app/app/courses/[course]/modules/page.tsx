import { HydrateClient, api } from "@/trpc/server";
import ModulesPage from "./client";
import { Suspense } from "react";
import { Album, FileText, Plus, Search } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { Button } from "@/components/ui/button";

export default async function ModulePreRender({
  params,
  params: { course },
}: {
  params: { course: string };
}) {
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
      <div className="mx-auto flex w-full flex-col justify-center gap-2 p-2 lg:flex-row">
        <aside className="relative h-[calc((100vh-4.5rem-1px)-2rem)] w-auto flex-shrink-0 rounded-lg border p-4 lg:sticky lg:top-[calc(4.5rem+0.5rem)] lg:h-[calc((100vh-4.5rem-1px)-1rem)] lg:w-[35ch]">
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
              <h2 className="text-xs text-muted-foreground">
                for {courseDetails?.classification ?? "Class"} (
                {courseDetails?.original_name ?? "Class"})
              </h2>
              <div className="m-1 flex items-center gap-2 rounded border px-3 py-2 [&:has(input:focus-visible)]:outline">
                <Search />
                <input
                  type="search"
                  placeholder="Search modules..."
                  className="flex-1 bg-background outline-none"
                />
              </div>
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
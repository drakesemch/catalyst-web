import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { UserAvatar } from "@/components/catalyst/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyEnrollmentType } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Album, UsersRound } from "lucide-react";

export default async function CourseHomePage(
  props: {
    params: Promise<{ course: string }>;
  }
) {
  const params = await props.params;

  const {
    course
  } = params;

  const people = await api.canvas.courses.get.people({
    courseId: Number(course),
  });

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 p-2 lg:flex-row">
      <aside className="relative h-[calc((100vh-4.5rem-1px)-2rem)] w-auto flex-shrink-0 rounded-lg border p-4 lg:sticky lg:top-[calc(4.5rem+0.5rem)] lg:h-[calc((100vh-4.5rem-1px)-1rem)] lg:w-[35ch]">
        <Tabs defaultValue="page" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="page">
              <UsersRound /> People
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
            <h1 className="h1">People</h1>
          </TabsContent>
        </Tabs>
      </aside>
      <main className="mx-auto flex w-[100ch] max-w-[100ch] flex-col p-4">
        {people.map((person) => (
          <div
            key={person.id}
            className="flex items-center gap-4 border-b p-4 text-lg"
          >
            <UserAvatar
              name={person.name}
              image={person.avatar_url}
              className="h-10 w-10"
            />
            <div className="flex flex-col gap-1">
              <span>{person.name}</span>
              <span className="text-xs text-muted-foreground">
                {prettyEnrollmentType(person.enrollments?.[0]?.role ?? "")}
              </span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

import { api } from "@/trpc/server";
import { GradesClient } from "./client";
import { notFound } from "next/navigation";
import { CourseSidebar } from "@/components/catalyst/app/course-sidebar";
import { expGradeCalculator } from "@/app/flags";

export default async function GradesPage({
  params: { course },
}: {
  params: { course: string };
}) {
  const courseDetails = await api.catalyst.user.canvas.courses.get({
    courseId: Number(course),
  });

  const grades = await api.canvas.courses.get.grades.list({
    courseId: Number(course),
  });

  const gradeGroups = await api.canvas.courses.get.grades.groups({
    courseId: Number(course),
  });

  if (!courseDetails) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 lg:flex-row">
      <GradesClient
        courseSidebar={<CourseSidebar course={course} />}
        course={course}
        courseDetails={courseDetails}
        grades={grades}
        gradeGroups={gradeGroups}
        useGrades={await expGradeCalculator()}
      />
    </div>
  );
}

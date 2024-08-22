import { prettyBody } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function CourseHomePage({
  params: { course },
}: {
  params: { course: string };
}) {
  const page = await api.canvas.courses.get.frontPage({
    courseId: Number(course),
  });
  return (
    <div>
      <main
        dangerouslySetInnerHTML={{ __html: prettyBody(page.body) }}
        className="render-fancy render-white-content mx-auto max-w-[100ch] p-4"
      ></main>
    </div>
  );
}

import { prettyBody } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function CourseHomePage({
  params: { course, page },
}: {
  params: { course: string; page: string };
}) {
  const pageDetail = await api.canvas.courses.get.pages.get({
    courseId: Number(course),
    pageId: page,
  });
  return (
    <div>
      <main
        dangerouslySetInnerHTML={{ __html: prettyBody(pageDetail.body) }}
        className="render-fancy render-white-content mx-auto max-w-[100ch] p-4"
      ></main>
    </div>
  );
}

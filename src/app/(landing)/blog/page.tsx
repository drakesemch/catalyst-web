import { LandingFooter } from "@/components/catalyst/landing/landing-navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import { api } from "@/trpc/server";

export const revalidate = 60 * 60 * 24; // 24 hours

export default async function Blogs() {
  const { data } = await api.catalyst.blog.list({});
  return (
    <>
      <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-16">
        <div className="flex w-[min(80ch,100%)] flex-col gap-6">
          <h1 className="h1">Blog</h1>
          {data.map((blog) => (
            <div key={blog.pathname}>
              <h2 className="h2">{blog.metadata.title as string}</h2>
              <p className="p">{blog.metadata.description as string}</p>
            </div>
          ))}
        </div>
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}

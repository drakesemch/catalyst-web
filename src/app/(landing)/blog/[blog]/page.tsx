import { LandingFooter } from "@/components/catalyst/landing/landing-navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export default async function Blog({
  params: { blog },
}: {
  params: { blog: string };
}) {
  const data = await api.catalyst.blog.get(`blogs/${blog}.md`);

  return (
    <>
      <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-16">
        <div className="flex w-[min(80ch,100%)] flex-col gap-6">
          <div>
            <Button href="/blog" variant="outline">
              <ArrowLeft /> Back to blog
            </Button>
          </div>
          <h1 className="h1">{data?.metadata.title as string}</h1>
          <p className="p">
            {(() => {
              function parseISOString(s: string) {
                const b = s.split(/\D+/);
                return new Date(
                  Date.UTC(
                    Number(b[0] ?? 0),
                    Number(b[1] ?? 0) - 1,
                    Number(b[2] ?? 0),
                    Number(b[3] ?? 0),
                    Number(b[4] ?? 0),
                    Number(b[5] ?? 0),
                    Number(b[6] ?? 0),
                  ),
                );
              }
              const date = parseISOString(data?.metadata.postDate as string);
              return format(date, "MMMM dd, yyyy 'at' h:mm a");
            })()}
          </p>
          <div dangerouslySetInnerHTML={{ __html: data?.html ?? "" }} />
        </div>
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}

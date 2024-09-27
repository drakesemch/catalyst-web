import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 60 * 60 * 24; // 24 hours

export default async function Blogs() {
  const { data } = await api.catalyst.blog.list({});
  return (
    <>
      <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
        <div className="flex w-[min(100ch,100%)] flex-col gap-6">
          <h1 className="h1">Blog</h1>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {data
              .filter((blog) => blog.html != "")
              .sort((a, b) =>
                (b.metadata.postDate as string).localeCompare(
                  a.metadata.postDate as string,
                ),
              )
              .map((blog) => (
                <Link
                  href={`/blog/${blog.pathname.split("/").at(-1)?.split(".")[0] ?? ""}`}
                  key={blog.pathname}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{blog.metadata.title as string}</CardTitle>
                      <CardDescription>
                        Published{" "}
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
                          const date = parseISOString(
                            (blog.metadata.postDate as string) ??
                              Date.toString(),
                          );
                          return format(
                            date,
                            "MMMM dd, yyyy 'at' h:mm a",
                          ) as unknown as string;
                        })()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="p">{blog.metadata.description as string}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="secondary" className="w-full">
                        <div>
                          Read More <ArrowRight />
                        </div>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}

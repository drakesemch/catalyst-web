import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { unstable_cache } from "next/cache";
import { list, type ListBlobResultBlob } from "@vercel/blob";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { env } from "process";

const getBlog = unstable_cache(
  async (pathname: string) => {
    const markdownFile = await fetch(pathname);
    const markdownContent = await markdownFile.text();
    const matterResult = matter(markdownContent);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);

    const renderHTML = processedContent
      .toString()
      .replaceAll("<h1>", "<h1 class='h1'>")
      .replaceAll("<h2>", "<h2 class='h2'>")
      .replaceAll("<h3>", "<h3 class='h3 mt-4'>")
      .replaceAll("<h4>", "<h4 class='h4'>")
      .replaceAll("<h5>", "<h5 class='h5'>")
      .replaceAll("<h6>", "<h6 class='h6'>")
      .replaceAll("<p>", "<p class='p'>");
    return {
      html: renderHTML,
      metadata: matterResult.data,
    };
  },
  ["blogs"],
);

export const blogRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const blogs = await unstable_cache(
        async () =>
          list({
            cursor: input.cursor ?? undefined,
            limit: input.limit ?? 100,
            prefix: "blogs/",
            mode: "expanded",
            token: env.BLOB_TOKEN,
          }),
        ["blogs", String(input.cursor ?? 0), String(input.limit ?? 0)],
      )();

      let data = blogs.blobs as (ListBlobResultBlob & {
        html: string;
        metadata: Record<string, unknown>;
      })[];

      data = await Promise.all(
        data.map(async (blog) => {
          const { html, metadata } = await getBlog(
            blog.downloadUrl.split("?")[0]!,
          );
          blog.html = html;
          blog.metadata = metadata;
          return blog;
        }),
      );

      return {
        data: data,
        nextCursor: blogs.cursor,
        hasMore: blogs.hasMore,
      };
    }),
  get: publicProcedure.input(z.string()).query(async ({ input }) => {
    const blog = await unstable_cache(
      async () =>
        list({
          limit: 1,
          prefix: input,
          token: env.BLOB_TOKEN,
        }),
      ["blogs", input],
    )();
    let data = blog.blobs as (ListBlobResultBlob & {
      html: string;
      metadata: Record<string, unknown>;
    })[];

    data = await Promise.all(
      data.map(async (blog) => {
        const { html, metadata } = await getBlog(
          blog.downloadUrl.split("?")[0]!,
        );
        blog.html = html;
        blog.metadata = metadata;
        return blog;
      }),
    );
    return data.at(0);
  }),
});

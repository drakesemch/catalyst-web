import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { unstable_cache } from "next/cache";
import { list, head, type ListBlobResultBlob } from "@vercel/blob";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { env } from "process";

const getBlog = unstable_cache(
  async (pathname: string) => {
    const markdownFile = await fetch(
      (await head(`blogs/${pathname}`, { token: env.BLOB_TOKEN })).downloadUrl,
    );
    const markdownContent = await markdownFile.text();
    const matterResult = matter(markdownContent);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);

    return {
      html: processedContent.toString(),
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
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const blogs = await unstable_cache(
        async () =>
          list({
            cursor: String(input.cursor ?? 0),
            limit: input.limit ?? 10,
            prefix: "blogs/",
            token: env.BLOB_TOKEN,
          }),
        ["blogs", String(input.cursor ?? 0), String(input.limit ?? 0)],
      )();

      const data = blogs.blobs as (ListBlobResultBlob & {
        html: string;
        metadata: Record<string, unknown>;
      })[];

      await Promise.all(
        data.map(async (blog) => {
          const { html, metadata } = await getBlog(blog.downloadUrl);
          blog.html = html;
          blog.metadata = metadata;
        }),
      );

      return {
        data: data,
        nextCursor: blogs.cursor,
        hasMore: blogs.hasMore,
      };
    }),
  get: publicProcedure.input(z.string()).query(async ({ input }) => {
    const blog = await getBlog(input);
    return blog;
  }),
});

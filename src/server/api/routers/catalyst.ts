import { createTRPCRouter } from "@/server/api/trpc";

import { blogRouter } from "./catalyst/blogs";

export const catalystRouter = createTRPCRouter({
  blog: blogRouter,
});

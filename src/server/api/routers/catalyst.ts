import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { blogRouter } from "./catalyst/blogs";

export const catalystRouter = createTRPCRouter({
  auth: {
    state: publicProcedure.query(({ ctx }) => {
      return {
        isLoggedIn: !!(ctx.session?.user ?? false),
      };
    }),
  },
  blog: blogRouter,
});

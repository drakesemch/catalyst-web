import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { blogRouter } from "./catalyst/blogs";

export const catalystRouter = createTRPCRouter({
  auth: {
    state: publicProcedure.query(({ ctx }) => {
      try {
        return {
          isLoggedIn: !!ctx.session?.user,
        };
      } catch (error) {
        return {
          isLoggedIn: false,
        };
      }
    }),
  },
  blog: blogRouter,
});

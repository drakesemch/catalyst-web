import { catalystRouter } from "@/server/api/routers/catalyst";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { canvasRouter } from "./routers/canvas";
import type { inferRouterOutputs } from "@trpc/server";

export const appRouter = createTRPCRouter({
  catalyst: catalystRouter,
  canvas: canvasRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);

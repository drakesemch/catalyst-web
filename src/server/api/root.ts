import { catalystRouter } from "@/server/api/routers/catalyst";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { canvasRouter } from "./routers/canvas";

export const appRouter = createTRPCRouter({
  catalyst: catalystRouter,
  canvas: canvasRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

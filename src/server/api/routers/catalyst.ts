import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { blogRouter } from "./catalyst/blogs";
import { z } from "zod";
import {
  periodTimes,
  periodType,
  periods,
  scheduleValues,
  schedules,
  schoolPermissions,
  schools,
  settings,
} from "@/server/db/schema";
import { and, count, eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createCipheriv } from "crypto";
import { env } from "@/env";
import { canvasCatalystRouter } from "./catalyst/canvas";

export const catalystRouter = createTRPCRouter({
  user: {
    authState: publicProcedure.query(({ ctx }) => {
      return !!ctx.session?.user;
    }),
    canvas: canvasCatalystRouter,
    schedule: {
      values: {
        get: publicProcedure.query(async ({ ctx }) => {
          const user = ctx.user.get;
          if (!user)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not found",
            });
          return await ctx.db
            .select()
            .from(scheduleValues)
            .where(eq(scheduleValues.userId, user.id));
        }),
        add: publicProcedure
          .input(
            z.object({
              periodId: z.string(),
              value: z.string(),
            }),
          )
          .mutation(async ({ ctx, input }) => {
            const user = ctx.user.get;
            if (!user)
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found",
              });
            if (
              (
                await ctx.db
                  .select({ count: count() })
                  .from(scheduleValues)
                  .where(
                    and(
                      eq(scheduleValues.userId, user.id),
                      eq(scheduleValues.periodId, input.periodId),
                    ),
                  )
              ).at(0)?.count == 0
            ) {
              await ctx.db.insert(scheduleValues).values({
                userId: user.id,
                periodId: input.periodId,
                value: input.value,
              });
            } else {
              await ctx.db
                .update(scheduleValues)
                .set({ value: input.value })
                .where(
                  and(
                    eq(scheduleValues.userId, user.id),
                    eq(scheduleValues.periodId, input.periodId),
                  ),
                );
            }
          }),
      },
    },
    settings: {
      get: publicProcedure.query(({ ctx }) => {
        return ctx.user.settings;
      }),
      finalize: publicProcedure.mutation(async ({ ctx }) => {
        const user = ctx.user.get;
        if (!user)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });
        await ctx.db
          .update(settings)
          .set({ draftState: "saved" })
          .where(
            and(eq(settings.userId, user.id), eq(settings.draftState, "draft")),
          );
      }),
      draft: publicProcedure
        .input(
          z.object({
            fName: z.string().optional(),
            lName: z.string().optional(),
            grade: z.string().optional(),
            schoolId: z.string().optional(),
            canvasToken: z.string().optional(),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          const keys = Object.entries({
            f_name: input.fName,
            l_name: input.lName,
            grade: input.grade,
            school_id: input.schoolId,
            canvas_token: input.canvasToken
              ? (() => {
                  const cipher = createCipheriv(
                    "aes-256-cbc",
                    env.NEXTAUTH_SECRET.substring(0, 32),
                    env.NEXTAUTH_SECRET.substring(33, 33 + 16),
                  );
                  const encryptedToken =
                    cipher.update(input.canvasToken, "utf8", "base64") +
                    cipher.final("base64");
                  return encryptedToken;
                })()
              : undefined,
          });

          if (keys.every(([, val]) => val == undefined)) return;

          const user = ctx.user.get;

          if (!user)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not found",
            });

          console.log("keys", keys);

          for (const [key, val] of keys) {
            if (val == undefined) continue;

            console.log("t");
            if (
              (
                await ctx.db
                  .select({ count: count() })
                  .from(settings)
                  .where(
                    and(eq(settings.key, key), eq(settings.userId, user.id)),
                  )
              ).at(0)?.count == 0
            ) {
              await ctx.db.insert(settings).values({
                key,
                value: val,
                draftState: "draft",
                userId: user.id,
              });
            } else {
              await ctx.db
                .update(settings)
                .set({ value: val })
                .where(
                  and(eq(settings.key, key), eq(settings.userId, user.id)),
                );
            }
          }
        }),
      save: publicProcedure.mutation(async ({ ctx }) => {
        const user = ctx.user.get;
        if (!user)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });
        await ctx.db
          .update(settings)
          .set({ draftState: "saved" })
          .where(
            and(eq(settings.userId, user.id), eq(settings.draftState, "draft")),
          );
      }),
    },
    get: publicProcedure.query(({ ctx }) => {
      return ctx.user.get;
    }),
  },
  school: {
    list: publicProcedure.query(async ({ ctx }) => {
      const user = ctx.user.get;
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });

      const schoolsList = await ctx.db
        .select()
        .from(schools)
        .where(
          or(
            eq(schools.draftState, "saved"),
            and(
              eq(schools.draftState, "saved"),
              eq(
                schools.id,
                (await ctx.db
                  .select({ schoolId: schoolPermissions.schoolId })
                  .from(schoolPermissions)
                  .where(eq(schoolPermissions.userId, user.id))
                  .limit(1)
                  .then((res) => res.at(0)?.schoolId)) ?? "",
              ),
            ),
          ),
        );
      return schoolsList;
    }),
    get: {
      draft: {
        details: publicProcedure
          .input(z.object({ id: z.string() }).optional())
          .query(async ({ input, ctx }) => {
            const user = ctx.user.get;
            if (!user)
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found",
              });

            let school = input?.id
              ? (
                  await ctx.db
                    .select()
                    .from(schools)
                    .where(eq(schools.id, input.id))
                ).at(0)
              : (
                  await ctx.db
                    .select()
                    .from(schools)
                    .where(
                      eq(
                        schools.id,
                        (await ctx.db
                          .select({ schoolId: schoolPermissions.schoolId })
                          .from(schoolPermissions)
                          .where(eq(schoolPermissions.userId, user.id))
                          .limit(1)
                          .then((res) => res.at(0)?.schoolId)) ?? "",
                      ),
                    )
                ).at(0);

            if (!school)
              school = (
                await ctx.db
                  .insert(schools)
                  .values({
                    name: "",
                    district: "",
                    address: "",
                    city: "",
                    state: "",
                    canvasURL: "",
                    draftState: "draft",
                  })
                  .returning()
              ).at(0);

            return school;
          }),
        periods: publicProcedure
          .input(z.object({ id: z.string() }).optional())
          .query(async ({ input, ctx }) => {
            const user = ctx.user.get;
            if (!user)
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found",
              });

            let school = input?.id
              ? (
                  await ctx.db
                    .select()
                    .from(schools)
                    .where(eq(schools.id, input.id))
                ).at(0)
              : (
                  await ctx.db
                    .select()
                    .from(schools)
                    .where(
                      and(
                        eq(
                          schools.id,
                          (await ctx.db
                            .select({ schoolId: schoolPermissions.schoolId })
                            .from(schoolPermissions)
                            .where(eq(schoolPermissions.userId, user.id))
                            .limit(1)
                            .then((res) => res.at(0)?.schoolId)) ?? "",
                        ),
                        eq(schools.draftState, "draft"),
                      ),
                    )
                ).at(0);

            if (!school) {
              if (input?.id != undefined)
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message: "School not found",
                });
              school = (
                await ctx.db
                  .insert(schools)
                  .values({
                    name: "",
                    district: "",
                    address: "",
                    city: "",
                    state: "",
                    canvasURL: "",
                    draftState: "draft",
                  })
                  .returning()
              ).at(0);
              if (!school)
                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Failed to create school",
                });
              await ctx.db.insert(schoolPermissions).values({
                schoolId: school.id,
                userId: user.id,
                role: "owner",
              });
            }

            const schoolPeriods = await ctx.db
              .select()
              .from(periods)
              .where(eq(periods.schoolId, school.id));

            const usedPeriods = new Set<string>();

            const finalPeriods = schoolPeriods
              .map((period) => {
                let options = undefined;
                if (period.type == "single") {
                  if (usedPeriods.has(period.periodId)) {
                    return undefined;
                  }
                  usedPeriods.add(period.periodId);
                  options = schoolPeriods
                    .filter((p) => p.periodId == period.periodId)
                    .map((opt) => ({
                      ...opt,
                      id: opt.optionId,
                      name: opt.optionName,
                    }))
                    .sort(
                      (a, b) => (a?.optionOrder ?? 0) - (b?.optionOrder ?? 0),
                    );
                }
                return {
                  ...period,
                  id: period.periodId,
                  name: period.periodName,
                  options,
                };
              })
              .filter((p) => p != undefined)
              .sort((a, b) => (a?.periodOrder ?? 0) - (b?.periodOrder ?? 0));

            return finalPeriods;
          }),
        schedules: publicProcedure.query(async ({ ctx }) => {
          const user = ctx.user.get;
          if (!user)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not found",
            });

          let school = (
            await ctx.db
              .select()
              .from(schools)
              .where(
                and(
                  eq(
                    schools.id,
                    (await ctx.db
                      .select({ schoolId: schoolPermissions.schoolId })
                      .from(schoolPermissions)
                      .where(eq(schoolPermissions.userId, user.id))
                      .limit(1)
                      .then((res) => res.at(0)?.schoolId)) ?? "",
                  ),
                  eq(schools.draftState, "draft"),
                ),
              )
          ).at(0);

          if (!school) {
            school = (
              await ctx.db
                .insert(schools)
                .values({
                  name: "",
                  district: "",
                  address: "",
                  city: "",
                  state: "",
                  canvasURL: "",
                  draftState: "draft",
                })
                .returning()
            ).at(0);
            if (!school)
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create school",
              });
            await ctx.db.insert(schoolPermissions).values({
              schoolId: school.id,
              userId: user.id,
              role: "owner",
            });
          }

          const schoolSchedules = await ctx.db
            .select()
            .from(schedules)
            .where(eq(schedules.schoolId, school.id));

          const finalSchedules = await Promise.all(
            schoolSchedules.map(async (schedule) => {
              const periods = (
                await ctx.db
                  .select()
                  .from(periodTimes)
                  .where(eq(periodTimes.scheduleId, schedule.id))
              )
                .map((period) => ({
                  ...period,
                  id: period.optionId,
                }))
                .sort((a, b) => a.order - b.order);

              return {
                ...schedule,
                periods,
              };
            }),
          );

          return finalSchedules;
        }),
      },
    },
    save: publicProcedure.mutation(async ({ ctx }) => {
      const user = ctx.user.get;
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      const school = (
        await ctx.db
          .select()
          .from(schools)
          .where(
            eq(
              schools.id,
              (await ctx.db
                .select({ schoolId: schoolPermissions.schoolId })
                .from(schoolPermissions)
                .where(eq(schoolPermissions.userId, user.id))
                .limit(1)
                .then((res) => res.at(0)?.schoolId)) ?? "",
            ),
          )
      ).at(0);

      if (!school)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "School not found",
        });

      await ctx.db
        .update(schools)
        .set({ draftState: "saved" })
        .where(eq(schools.id, school.id));
      await ctx.db
        .update(periods)
        .set({ draftState: "saved" })
        .where(eq(periods.schoolId, school.id));
      await ctx.db
        .update(schedules)
        .set({ draftState: "saved" })
        .where(eq(schedules.schoolId, school.id));
    }),
    draft: publicProcedure
      .input(
        z.object({
          id: z.string().optional(),
          name: z.string().optional(),
          district: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().max(2).optional(),
          url: z.string().optional(),
          periods: z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                type: z.enum(periodType.enumValues),
                options: z
                  .array(z.object({ id: z.string(), name: z.string() }))
                  .optional(),
              }),
            )
            .optional(),
          schedules: z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                periods: z.array(
                  z.object({
                    id: z.string(),
                    start: z.string(),
                    end: z.string(),
                  }),
                ),
              }),
            )
            .optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const user = ctx.user.get;
        if (!user)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });

        let school = (
          await ctx.db
            .select()
            .from(schools)
            .where(
              eq(
                schools.id,
                input.id ??
                  (await ctx.db
                    .select({ schoolId: schoolPermissions.schoolId })
                    .from(schoolPermissions)
                    .where(eq(schoolPermissions.userId, user.id))
                    .limit(1)
                    .then((res) => res.at(0)?.schoolId)) ??
                  "",
              ),
            )
        ).at(0);

        if (!school) {
          if (input.id != undefined)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "School not found",
            });
          school = (
            await ctx.db
              .insert(schools)
              .values({
                name: "",
                district: "",
                address: "",
                city: "",
                state: "",
                canvasURL: "",
                draftState: "draft",
              })
              .returning()
          ).at(0);
          if (!school)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create school",
            });
          await ctx.db.insert(schoolPermissions).values({
            schoolId: school.id,
            userId: user.id,
            role: "owner",
          });
        }

        const keys = Object.entries({
          name: input.name,
          district: input.district,
          address: input.address,
          city: input.city,
          state: input.state,
          canvasURL: input.url,
        });

        for (const [key, val] of keys) {
          if (val == undefined) continue;
          await ctx.db
            .update(schools)
            .set({ [key]: val })
            .where(eq(schools.id, school.id));
        }

        if (input.periods) {
          await ctx.db.delete(periods).where(eq(periods.schoolId, school.id));

          let idx = 0;
          for (const period of input.periods) {
            idx++;
            if (period.options) {
              let subIdx = 0;
              for (const option of period.options) {
                subIdx++;
                await ctx.db.insert(periods).values({
                  periodId: period.id,
                  optionId: option.id,
                  periodOrder: idx,
                  optionOrder: subIdx,
                  periodName: period.name,
                  optionName: option.name,
                  draftState: "draft",
                  type: period.type,
                  schoolId: school.id,
                });
              }
            } else {
              await ctx.db.insert(periods).values({
                periodId: period.id,
                optionId: period.id,
                periodName: period.name,
                optionName: period.name,
                type: period.type,
                schoolId: school.id,
                periodOrder: idx,
                optionOrder: 1,
                draftState: "draft",
              });
            }
          }
        }

        if (input.schedules) {
          await ctx.db
            .delete(schedules)
            .where(eq(schedules.schoolId, school.id));
          await ctx.db
            .delete(periodTimes)
            .where(eq(periodTimes.schoolId, school.id));

          for (const schedule of input.schedules) {
            const savedSchedule = (
              await ctx.db
                .insert(schedules)
                .values({
                  name: schedule.name,
                  schoolId: school.id,
                  draftState: "draft",
                })
                .returning()
            ).at(0);

            if (!savedSchedule)
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create schedule",
              });

            let idx = 0;
            for (const period of schedule.periods) {
              idx++;
              await ctx.db.insert(periodTimes).values({
                schoolId: school.id,
                optionId: period.id,
                scheduleId: savedSchedule.id,
                order: idx,
                start: period.start,
                end: period.end,
              });
            }
          }
        }
      }),
  },
  blog: blogRouter,
});

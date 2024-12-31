import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { blogRouter } from "./catalyst/blogs";
import { z } from "zod";
import {
  notifications,
  periodTimes,
  periodType,
  periods,
  scheduleDates,
  scheduleValues,
  schedules,
  schoolPermissions,
  schools,
  settings,
  users,
} from "@/server/db/schema";
import { and, count, eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createCipheriv } from "crypto";
import { env } from "@/env";
import { canvasCatalystRouter } from "./catalyst/canvas";
import { Stripe } from "stripe";

export const catalystRouter = createTRPCRouter({
  pricing: {
    pro: publicProcedure.query(async () => {
      const stripe = new Stripe(env.STRIPE_API);
      const defaultPrice = await stripe.products.retrieve(env.PRO_ID);
      return await stripe.prices.list({ product: String(defaultPrice.id) });
    }),
    pay: protectedProcedure
      .input(z.object({ priceId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const stripe = new Stripe(env.STRIPE_API);
        let customer = (
          await stripe.customers.list({
            email: ctx.user.get?.email,
          })
        ).data[0];
        if (!customer) {
          customer = await stripe.customers.create({
            email: ctx.user.get?.email,
            metadata: {
              catalyst_user_id: ctx.user.get?.id ?? "guest",
            },
          });
        }
        if (customer.metadata.catalyst_user_id != ctx.user.get?.id) {
          await stripe.customers.update(customer.id, {
            metadata: {
              catalyst_user_id: ctx.user.get?.id ?? "guest",
            },
          });
        }
        return await stripe.checkout.sessions.create({
          mode: "subscription",
          line_items: [
            {
              price: input.priceId,
              quantity: 1,
            },
          ],
          customer: customer.id,
          success_url: env.NEXTAUTH_URL + "/app/upgrade/confirm",
        });
      }),
  },
  user: {
    delete: protectedProcedure.mutation(async ({ ctx }) => {
      const user = ctx.user.get;
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      await ctx.db.delete(users).where(eq(users.id, user.id));
    }),
    authState: publicProcedure.query(({ ctx }) => {
      return !!ctx.session?.user;
    }),
    isPro: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user.isPro;
    }),
    friends: {
      request: {
        getDetails: protectedProcedure
          .input(z.object({ id: z.string() }))
          .query(async ({ input, ctx }) => {
            const user = ctx.user.get;
            if (!user)
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found",
              });
            return (
              await ctx.db
                .select()
                .from(users)
                .where(and(eq(users.id, input.id)))
            )[0];
          }),
      },
    },
    notifications: {
      list: {
        active: protectedProcedure.query(async ({ ctx }) => {
          const user = ctx.user.get;
          if (!user)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not found",
            });
          return await ctx.db
            .select()
            .from(notifications)
            .where(
              and(
                eq(notifications.userId, user.id),
                eq(notifications.dismissed, false),
              ),
            );
        }),
        archived: protectedProcedure.query(async ({ ctx }) => {
          const user = ctx.user.get;
          if (!user)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not found",
            });
          return await ctx.db
            .select()
            .from(notifications)
            .where(
              and(
                eq(notifications.userId, user.id),
                eq(notifications.dismissed, true),
              ),
            );
        }),
      },
      archive: protectedProcedure
        .input(z.object({ dismissed: z.boolean(), id: z.string() }))
        .mutation(async ({ input, ctx }) => {
          const user = ctx.user.get;
          if (!user)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not found",
            });
          await ctx.db
            .update(notifications)
            .set({ dismissed: input.dismissed })
            .where(
              and(
                eq(notifications.userId, user.id),
                eq(notifications.id, input.id),
              ),
            );
        }),
    },
    canvas: canvasCatalystRouter,
    schedule: {
      values: {
        get: protectedProcedure.query(async ({ ctx }) => {
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
        add: protectedProcedure
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
      get: protectedProcedure.query(({ ctx }) => {
        return ctx.user.settings;
      }),
      finalize: protectedProcedure.mutation(async ({ ctx }) => {
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
      draft: protectedProcedure
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

          for (const [key, val] of keys) {
            if (val == undefined) continue;
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
      save: protectedProcedure.mutation(async ({ ctx }) => {
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
    get: protectedProcedure.query(({ ctx }) => {
      return ctx.user.get;
    }),
  },
  school: {
    saveRaw: protectedProcedure
      .input(
        z.object({
          periods: z.array(
            z.object({
              periodId: z.string(),
              periodOrder: z.number(),
              periodName: z.string(),
              options: z
                .array(
                  z.object({
                    optionId: z.string(),
                    optionOrder: z.number(),
                    optionName: z.string(),
                  }),
                )
                .optional(),
              type: z.enum(periodType.enumValues),
            }),
          ),
          schedules: z.array(
            z.object({
              name: z.string(),
              periods: z.array(
                z.object({
                  id: z.string(),
                  start: z.string(),
                  end: z.string(),
                }),
              ),
            }),
          ),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const user = ctx.user.get;
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });
        }

        await ctx.db.transaction(async (trx) => {
          await trx
            .delete(periods)
            .where(
              eq(
                periods.schoolId,
                ctx.user.settings?.find((setting) => setting.key == "school_id")
                  ?.value ?? "",
              ),
            );
          await trx
            .delete(schedules)
            .where(
              eq(
                schedules.schoolId,
                ctx.user.settings?.find((setting) => setting.key == "school_id")
                  ?.value ?? "",
              ),
            );
          await trx
            .delete(periodTimes)
            .where(
              eq(
                periodTimes.schoolId,
                ctx.user.settings?.find((setting) => setting.key == "school_id")
                  ?.value ?? "",
              ),
            );

          for (const period of input.periods) {
            if (period.options) {
              for (const option of period.options) {
                await trx.insert(periods).values({
                  periodId: period.periodId,
                  optionId: option.optionId,
                  periodOrder: period.periodOrder,
                  optionOrder: option.optionOrder,
                  periodName: period.periodName,
                  optionName: option.optionName,
                  type: period.type,
                  schoolId:
                    ctx.user.settings?.find(
                      (setting) => setting.key == "school_id",
                    )?.value ?? "",
                });
              }
            } else {
              await trx.insert(periods).values({
                periodId: period.periodId,
                optionId: period.periodId,
                periodOrder: period.periodOrder,
                optionOrder: 1,
                periodName: period.periodName,
                optionName: period.periodName,
                type: period.type,
                schoolId:
                  ctx.user.settings?.find(
                    (setting) => setting.key == "school_id",
                  )?.value ?? "",
              });
            }
          }

          for (const schedule of input.schedules) {
            const savedSchedule = (
              await trx
                .insert(schedules)
                .values({
                  name: schedule.name,
                  schoolId:
                    ctx.user.settings?.find(
                      (setting) => setting.key == "school_id",
                    )?.value ?? "",
                  draftState: "draft",
                })
                .returning()
            ).at(0);

            if (!savedSchedule) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create schedule",
              });
            }

            let idx = 0;
            for (const period of schedule.periods) {
              idx++;
              await trx.insert(periodTimes).values({
                schoolId:
                  ctx.user.settings?.find(
                    (setting) => setting.key == "school_id",
                  )?.value ?? "",
                optionId: period.id,
                scheduleId: savedSchedule.id,
                order: idx,
                start: period.start,
                end: period.end,
              });
            }
          }
        });
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
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
      permissions: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
          const user = ctx.user.get;
          if (!user)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "User not found",
            });

          return await ctx.db
            .select()
            .from(schoolPermissions)
            .where(
              and(
                eq(schoolPermissions.userId, user.id),
                eq(schoolPermissions.schoolId, input.id),
              ),
            );
        }),
      scheduleDates: {
        get: protectedProcedure
          .input(z.object({ id: z.string() }))
          .query(async ({ input, ctx }) => {
            const user = ctx.user.get;
            if (!user)
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found",
              });

            const scheduleDatesList = await ctx.db
              .select()
              .from(scheduleDates)
              .where(eq(scheduleDates.schoolId, input.id));

            return scheduleDatesList;
          }),
        set: protectedProcedure
          .input(
            z.object({
              id: z.string(),
              items: z.array(
                z.object({
                  id: z.string(),
                  date: z.date(),
                }),
              ),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const user = ctx.user.get;
            if (!user)
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found",
              });

            await ctx.db
              .delete(scheduleDates)
              .where(eq(scheduleDates.schoolId, input.id));

            for (const item of input.items) {
              await ctx.db.insert(scheduleDates).values({
                date: item.date,
                scheduleId: item.id,
                schoolId: input.id,
                draftState: "saved",
              });
            }
          }),
      },
      currentSchool: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.user.get;
        if (!user)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });

        return (
          await ctx.db
            .select()
            .from(schools)
            .where(
              eq(
                schools.id,
                ctx.user.settings.find((val) => val.key == "school_id")
                  ?.value ?? "",
              ),
            )
        )[0];
      }),
      draft: {
        details: protectedProcedure
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
        periods: protectedProcedure
          .input(z.object({ id: z.string().optional() }).optional())
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
                        // eq(schools.draftState, "draft"),
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
                  type: period.type!,
                  periodOrder: period.periodOrder!,
                  optionOrder: period.optionOrder!,
                  options,
                };
              })
              .filter((p) => p != undefined)
              .sort((a, b) => (a?.periodOrder ?? 0) - (b?.periodOrder ?? 0));
            console.log(finalPeriods);
            return finalPeriods;
          }),
        schedules: protectedProcedure.query(async ({ ctx }) => {
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
                  // eq(schools.draftState, "draft"),
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
      saved: {
        get: protectedProcedure
          .input(z.object({ id: z.string() }))
          .query(async ({ input, ctx }) => {
            const user = ctx.user.get;
            if (!user)
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not found",
              });

            return await ctx.db
              .select()
              .from(schools)
              .where(
                eq(
                  schools.id,
                  input?.id ??
                    ctx.user.settings.find((val) => val.key == "school_id")
                      ?.value ??
                    "",
                ),
              );
          }),
        schedules: protectedProcedure
          .input(z.object({ id: z.string() }))
          .query(async ({ input, ctx }) => {
            const listedSchedules = await ctx.db
              .select()
              .from(schedules)
              .fullJoin(schools, eq(schedules.schoolId, schools.id))
              .where(
                or(
                  eq(
                    schools.id,
                    input?.id ??
                      ctx.user.settings?.find((val) => val.key == "school_id")
                        ?.value ??
                      "",
                  ),
                  eq(schedules.draftState, "saved"),
                ),
              );

            const finalSchedules = await Promise.all(
              listedSchedules.map(async (schedule) => {
                const listedPeriods = await ctx.db
                  .select()
                  .from(periodTimes)
                  .fullJoin(periods, eq(periodTimes.optionId, periods.optionId))
                  .fullJoin(
                    scheduleValues,
                    and(
                      eq(periods.periodId, scheduleValues.periodId),
                      eq(scheduleValues.userId, ctx.user.get?.id ?? ""),
                    ),
                  )
                  .where(
                    eq(periodTimes.scheduleId, schedule?.schedule?.id ?? ""),
                  )
                  .orderBy(periodTimes.order);

                return {
                  ...schedule,
                  periods: listedPeriods,
                };
              }),
            );

            return finalSchedules;
          }),
      },
    },
    save: protectedProcedure.mutation(async ({ ctx }) => {
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
    draft: protectedProcedure
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

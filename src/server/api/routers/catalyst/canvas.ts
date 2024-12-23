import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { z } from "zod";
import { env } from "@/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { unstable_cache } from "next/cache";
import type { Submission, Course } from "../canvas";
import { createClient } from "@vercel/kv";
import {
  courseClassification,
  periodTimes,
  periods,
  scheduleDates,
  scheduleValues,
  schedules,
  settings,
} from "@/server/db/schema";
import { type InferSelectModel, and, eq } from "drizzle-orm";
import { db } from "@/server/db";

export const courseClassificationDataset = [
  { text: "input: BVW Counseling" },
  { text: "output: Persistent" },
  { text: "input: Health Wellness (online)-Haggerty-SU" },
  { text: "output: Physical Education" },
  { text: "input: BVW Library 2022-2023" },
  { text: "output: Persistent" },
  { text: "input: PRMS Counseling" },
  { text: "output: Persistent" },
  { text: "input: Sources of Strength" },
  { text: "output: Activity" },
  { text: "input: 1. Advanced Math O'Neal-Q4" },
  { text: "output: Math" },
  { text: "input: 6th Grade Band" },
  { text: "output: Arts" },
  { text: "input: 2021 Advanced Integrated Mathematics 7-O'Neal-Q3" },
  { text: "output: Math" },
  { text: "input: 2021 Summer Band" },
  { text: "output: Activity" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q1" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q2" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q3" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q4" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 7-Mitchem-Q1" },
  { text: "output: Math" },
  { text: "input: Advisory -9th Grade-Hoyt-YR" },
  { text: "output: Persistent" },
  { text: "input: Algebra 1 Qtr 1-Fleer-Q1" },
  { text: "output: Math" },
  { text: "input: Algebra 1 Qtr 2-Fleer-Q2" },
  { text: "output: Math" },
  { text: "input: Algebra 1 Qtr 3-Fleer-Q3" },
  { text: "output: Math" },
  { text: "input: Algebra 1 Qtr 4-Fleer-Q4" },
  { text: "output: Math" },
  { text: "input: Art 6 (Q2)" },
  { text: "output: Arts" },
  { text: "input: Band 6 Quarter 4-Gamble-Q4" },
  { text: "output: Arts" },
  { text: "input: Band 6-Gamble-Q1" },
  { text: "output: Arts" },
  { text: "input: Band 6-Q3" },
  { text: "output: Arts" },
  { text: "input: Band 7 Quarter 3-Gamble-Q3" },
  { text: "output: Arts" },
  { text: "input: Band 7 Quarter 4-Gamble-Q4" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 1-Gamble-Q1" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 2-Gamble-Q2" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 3-Gamble-Q3" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 4-Gamble-Q4" },
  { text: "output: Arts" },
  { text: "input: CHE 5th Grade Art" },
  { text: "output: Arts" },
  { text: "input: E.L.A. 7 Q3-Kennedy" },
  { text: "output: English" },
  { text: "input: ELA 7 Q2 Virtual" },
  { text: "output: English" },
  { text: "input: ELA Q4 Kennedy" },
  { text: "output: English" },
  { text: "input: Elementary Band Grade 5-Gamble-YR" },
  { text: "output: Arts" },
  { text: "input: Elementary Foreign Language Spanish Grade 4-Davidson-YR" },
  { text: "output: Language" },
  { text: "input: Elementary General Classroom Grade 4-Schwabauer-YR" },
  { text: "output: Persistent" },
  { text: "input: Elementary General Classroom Grade 5-Auvigne-YR" },
  { text: "output: Persistent" },
  { text: "input: Elementary Mathematics Grade 5-Auvigne-YR" },
  { text: "output: Math" },
  { text: "input: English Language Arts 6 Quarter 1-Mensendiek-Q1" },
  { text: "output: English" },
  { text: "input: English Language Arts 6 Quarter 2-Mensendiek-Q2" },
  { text: "output: English" },
  { text: "input: English Language Arts 6 Quarter 3-Mensendiek-Q3" },
  { text: "output: English" },
  { text: "input: English Language Arts 6 Quarter 4-Mensendiek-Q4" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 1-Secrest-Q1" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 2-Secrest-Q2" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 3-Secrest-Q3" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 4-Secrest-Q4" },
  { text: "output: English" },
  { text: "input: Flex Class-Fleer-YR" },
  { text: "output: Persistent" },
  { text: "input: Flex Class-Kennedy-YR" },
  { text: "output: Persistent" },
  { text: "input: Flex Class-Stanfield-YR" },
  { text: "output: Persistent" },
  { text: "input: Hnrs Biology-Hall-S2" },
  { text: "output: Science" },
  { text: "input: Hnrs Biology-Skakal-S1" },
  { text: "output: Science" },
  { text: "input: Hnrs Geometry-Young-S1" },
  { text: "output: Math" },
  { text: "input: Hnrs Geometry-Young-S2" },
  { text: "output: Math" },
  { text: "input: Honors ELA 9 - Fall 2022" },
  { text: "output: English" },
  { text: "input: Virtual Physical Education 7-Maasen-Q2" },
  { text: "output: Physical Education" },
  { text: "input: Virtual Physical Education 7-Maasen-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Spanish 3.0-Horstick-S1" },
  { text: "output: Language" },
  { text: "input: Intervention 7-Kennedy-YR" },
  { text: "output: Persistent" },
  { text: "input: Introduction to Engineering Design-Vodehnal-S1" },
  { text: "output: Technology" },
  { text: "input: Introduction to Engineering Design-Vodehnal-S2" },
  { text: "output: Technology" },
  { text: "input: Jag Hub 2022-23" },
  { text: "output: Persistent" },
  { text: "input: Physical Education 6-Long-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education 6-Long-Q2" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education 8-Rutherford-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education 8-Rutherford-Q2" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education-Lowe-S1" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education-Lowe-S2" },
  { text: "output: Physical Education" },
  { text: "input: Pre-Engineering Robotics 7-Shatzer-Q4" },
  { text: "output: Technology" },
  { text: "input: Pre-Engineering & Robotics 7-Shatzer-Q3" },
  { text: "output: Technology" },
  { text: "input: Pre-engineering 6-Shatzer-Q4" },
  { text: "output: Technology" },
  { text: "input: Pre-engineering 8-Shatzer-Q3" },
  { text: "output: Technology" },
  { text: "input: Pre-engineering 8-Shatzer-Q4" },
  { text: "output: Technology" },
  { text: "input: Science - Jackson - Q3" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 1-Stanfield-Q1" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 2-Stanfield-Q2" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 3-Stanfield-Q3" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 4-Stanfield-Q4" },
  { text: "output: Science" },
  { text: "input: Science 7 Quarter 1-Durick-Q1" },
  { text: "output: Science" },
  { text: "input: Science 7 Quarter 2-Durick-Q2" },
  { text: "output: Science" },
  { text: "input: Science 7: Q3" },
  { text: "output: Science" },
  { text: "input: Science 7: Q4" },
  { text: "output: Science" },
  { text: "input: Science 8 Quarter 1-Jackson-Q1" },
  { text: "output: Science" },
  { text: "input: Science 8 Quarter 2-Jackson-Q2" },
  { text: "output: Science" },
  { text: "input: Science 8 Quarter 4-Jackson-Q4" },
  { text: "output: Science" },
  { text: "input: Social Studies 6 Quarter 1-Stanfield-Q1" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 6 Quarter 2-Stanfield-Q2" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 6 Quarter 3-Stanfield-Q3" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 6 Quarter 4-Stanfield-Q4" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 7 Q 3-Kennedy" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 7 Quarter 4-Kennedy-Q4" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 8 Quarter 1-Modelski-Q1" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 8 Quarter 3-Modelski-Q3" },
  { text: "output: Social Studies" },
  { text: "input: Spanish 1A-Payne-Q3" },
  { text: "output: Language" },
  { text: "input: Spanish 1A-Payne-Q4" },
  { text: "output: Language" },
  { text: "input: Spanish 1B-Landeras-S2" },
  { text: "output: Language" },
  { text: "input: Spanish 1B-Vater-S1" },
  { text: "output: Language" },
  { text: "input: Spanish 2-Kessens-S1" },
  { text: "output: Language" },
  { text: "input: Spanish 2-Kessens-S2" },
  { text: "output: Language" },
  { text: "input: Spanish 3.0-Horstick-S1" },
  { text: "output: Language" },
  { text: "input: Spanish 3.0-Horstick-S2" },
  { text: "output: Language" },
  { text: "input: Symphonic Band - 2023" },
  { text: "output: Arts" },
  { text: "input: Technology Explorations 6-Anderson-Q1" },
  { text: "output: Technology" },
  { text: "input: VEd Social Studies 7 - Q1" },
  { text: "output: Social Studies" },
  { text: "input: Ved Social Studies 7 Q2" },
  { text: "output: Social Studies" },
  { text: "input: Virtual Advanced Mathematics 7-Mitchem-Q2" },
  { text: "output: Math" },
  { text: "input: Virtual ELA - Q1" },
  { text: "output: English" },
  { text: "input: Virtual Physical Education 7-Maasen-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Virtual Physical Education 7-Maasen-Q2" },
  { text: "output: Physical Education" },
  { text: "input: VirtualED - 7th Grade Band" },
  { text: "output: Arts" },
  { text: "input: VirtualED Band 7 - Q2" },
  { text: "output: Arts" },
  { text: "input: Theatre 6-Shute-Q3" },
  { text: "output: Arts" },
  { text: "input: Elementary Reading Grade 4-Schwabauer-YR" },
  { text: "output: English" },
  { text: "input: BVW Esports" },
  { text: "output: Activity" },
  { text: "input: AP English Language Composition-EL0310-Signer-6" },
  { text: "output: English" },
];

export const canvasCatalystRouter = createTRPCRouter({
  details: protectedProcedure.query(async ({ ctx }) => {
    return {
      url: ctx.user.canvas.url,
      token: ctx.user.canvas.token,
    };
  }),
  schedule: {
    current: protectedProcedure.query(async ({ ctx }) => {
      let now = new Date();
      now = new Date(
        `${String(now.getUTCFullYear()).padStart(4, "0")}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}T00:00:00.000Z`,
      );
      const scheduleDate = (
        await db
          .select()
          .from(scheduleDates)
          .where(
            and(
              eq(
                scheduleDates.schoolId,
                ctx.user.settings?.find((setting) => setting.key == "school_id")
                  ?.value ?? "",
              ),
              eq(scheduleDates.date, now),
            ),
          )
      ).at(0);
      const schedule = (
        await db
          .select()
          .from(schedules)
          .where(eq(schedules.id, scheduleDate?.scheduleId ?? ""))
      ).at(0);
      if (scheduleDate == undefined)
        return {
          ...(schedule ?? {}),
          ...(scheduleDate ?? {}),
          times: [],
        };
      const times = await Promise.all(
        (
          await db
            .select()
            .from(periodTimes)
            .where(eq(periodTimes.scheduleId, scheduleDate.scheduleId))
            .fullJoin(periods, eq(periodTimes.optionId, periods.optionId))
            .fullJoin(
              scheduleValues,
              and(
                eq(periods.periodId, scheduleValues.periodId),
                eq(scheduleValues.userId, ctx.user.get?.id ?? ""),
              ),
            )
        ).map(async (period) => {
          if (period.schedule_value?.value == undefined) return;
          if (period.period?.type == "course") {
            const url = new URL(
              `/api/v1/courses/${period.schedule_value?.value ?? 0}`,
              ctx.user.canvas.url,
            );
            url.searchParams.set("include[]", "total_scores");
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            if (!query.ok) return null;
            const course = (await query.json()) as Course;
            const classification = (await unstable_cache(async () => {
              let classificationRedis;
              try {
                classificationRedis = createClient({
                  url: env.CLASSIFICATION_REST_API_URL,
                  token: env.CLASSIFICATION_REST_API_TOKEN,
                });
              } catch (err) {
                // oops
              }

              try {
                let classification;
                try {
                  classification = await classificationRedis?.get(
                    String(course.id),
                  );
                } catch (err) {
                  // oops
                }

                if (classification) {
                  return classification;
                }
              } catch (err) {
                console.error(err);
              }

              const classificationFromDB = await ctx.db
                .select()
                .from(courseClassification)
                .where(eq(courseClassification.key, String(course.id)));

              if (classificationFromDB.length > 0) {
                try {
                  await classificationRedis?.set(
                    String(course.id),
                    classificationFromDB[0]!.value,
                  );
                } catch (err) {
                  // oops
                }
                return classificationFromDB[0]!.value;
              }

              const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

              const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: "return the output value",
              });

              const generationConfig = {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 100,
                stopSequences: ["input:", "\n"],
                responseMimeType: "text/plain",
              };

              const input = [
                ...courseClassificationDataset,
                {
                  text: "input: " + course.original_name,
                },
                {
                  text: "output: ",
                },
              ];
              let result;
              try {
                result = await model
                  .generateContent({
                    contents: [{ role: "user", parts: input }],
                    generationConfig,
                  })
                  .catch((err) => {
                    console.error(err);
                    return undefined;
                  });
              } catch (err) {
                // oops
              }

              const value = result?.response?.text() ?? "Not Available";

              if (value != "Not Available") {
                try {
                  try {
                    await classificationRedis?.set(String(course.id), value);
                  } catch (err) {
                    // oops
                  }
                  try {
                    await ctx.db.insert(courseClassification).values({
                      key: String(course.id),
                      value,
                    });
                  } catch (err) {
                    // oops
                  }
                } catch (err) {
                  console.error(err);
                }
              }

              return value;
            }, ["courses", "classifications", String(course.id)])()) as string;

            period.schedule_value.value = {
              ...course,
              original_name: course.original_name ?? course.name,
              classification,
            } as unknown as string;
          } else if (period.period?.type == "single") {
            period.schedule_value.value = (period.schedule_value?.value ==
              period.period.optionId) as unknown as string;
          }
          return period;
        }),
      );

      const revised_times = times as Array<
        (typeof times)[0] & { schedule_value: { value: boolean | Course } }
      >;
      return { ...schedule, ...scheduleDate, times: revised_times };
    }),
  },
  courses: {
    get: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const url = new URL(
          `/api/v1/courses/${input.courseId}`,
          ctx.user.canvas.url,
        );
        url.searchParams.set("include[]", "total_scores");
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        if (!query.ok) return null;
        const course = (await query.json()) as Course;
        const classification = (await unstable_cache(
          async () => {
            const classificationRedis = createClient({
              url: env.CLASSIFICATION_REST_API_URL,
              token: env.CLASSIFICATION_REST_API_TOKEN,
            });

            try {
              const classification = await classificationRedis.get(
                String(course.id),
              );

              if (classification) {
                return classification;
              }
            } catch (err) {
              console.error(err);
            }

            const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

            const model = genAI.getGenerativeModel({
              model: "gemini-1.5-flash",
              systemInstruction: "return the output value",
            });

            const generationConfig = {
              temperature: 1,
              topP: 0.95,
              topK: 64,
              maxOutputTokens: 100,
              stopSequences: ["input:", "\n"],
              responseMimeType: "text/plain",
            };

            const input = [
              ...courseClassificationDataset,
              {
                text: "input: " + course.original_name,
              },
              {
                text: "output: ",
              },
            ];
            let result;
            try {
              result = await model
                .generateContent({
                  contents: [{ role: "user", parts: input }],
                  generationConfig,
                })
                .catch((err) => {
                  console.error(err);
                  return undefined;
                });
            } catch (err) {
              // oops
            }

            const value = result?.response?.text() ?? "Not Available";

            if (value != "Not Available") {
              try {
                await classificationRedis.set(String(course.id), value);
              } catch (err) {
                console.error(err);
              }
            }

            return value;
          },
          ["courses", "classifications", String(course.id)],
          {
            revalidate: 60 /*s*/ * 60 /*m*/ * 24 /*h*/ * 7 /*d*/,
          },
        )()) as string;
        const periodValues = await ctx.db
          .select()
          .from(scheduleValues)
          .where(eq(scheduleValues.userId, ctx.user.get?.id ?? ""));

        const userSettings = await ctx.db
          .select()
          .from(settings)
          .where(eq(settings.userId, ctx.user.get?.id ?? ""));

        const schoolPeriods = await ctx.db
          .select()
          .from(periods)
          .where(
            eq(
              periods.schoolId,
              userSettings.find((val) => val.key == "school_id")?.value ?? "",
            ),
          );

        const currentSchedule = await ctx.db
          .select()
          .from(scheduleDates)
          .where(
            and(
              eq(
                scheduleDates.schoolId,
                userSettings.find((val) => val.key == "school_id")?.value ?? "",
              ),
              eq(
                scheduleDates.date,
                new Date(new Date().toDateString() + " 00:00:00 UTC"),
              ),
            ),
          );

        const schedule = await ctx.db
          .select()
          .from(periodTimes)
          .where(
            eq(
              periodTimes.scheduleId,
              currentSchedule.find((val) => val.id == currentSchedule[0]?.id)
                ?.scheduleId ?? "",
            ),
          );

        const assignmentURL = new URL(
          `/api/v1/courses/${course.id}/students/submissions`,
          ctx.user.canvas.url,
        );

        assignmentURL.searchParams.set("per_page", "100");
        assignmentURL.searchParams.append("include[]", "assignment");

        const assignmentsQuery = await fetch(assignmentURL, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });

        const submissionData = (await assignmentsQuery.json()) as Submission[];

        const missingAssignments = submissionData.filter(
          (assignment) =>
            (!assignment.excused &&
              assignment.score == 0 &&
              assignment.assignment?.points_possible != 0) ||
            assignment.missing,
        ).length;

        return {
          ...course,
          original_name: course.original_name ?? course.name,
          classification,
          data: {
            missingAssignments,
          },
          period: schoolPeriods.find(
            (period) =>
              period.periodId ==
              periodValues.find((val) => Number(val.value) == course.id)
                ?.periodId,
          ),
          time: schedule.find(
            (time) =>
              time.optionId ==
              periodValues.find((val) => Number(val.value) == course.id)
                ?.periodId,
          ),
        };
      }),
    list: protectedProcedure
      .input(
        z
          .object({
            enrollment_state: z
              .enum(["active", "invited_or_pending", "completed"])
              .optional(),
            limit: z.number().max(1000).optional(),
            include: z.array(z.enum(["total_scores"])).optional(),
            cursor: z.string().optional(),
          })
          .optional(),
      )
      .query(async ({ ctx, input }) => {
        type Return = (Course & {
          classification: string;
          data: {
            missingAssignments: number;
          };
          period: InferSelectModel<typeof periods>;
          time: InferSelectModel<typeof periodTimes>;
        })[];
        return unstable_cache(
          async () => {
            const url = new URL("/api/v1/courses", ctx.user.canvas.url);
            input?.enrollment_state
              ? url.searchParams.set("enrollment_state", input.enrollment_state)
              : null;
            url.searchParams.set("page", String(input?.cursor ?? 1));
            url.searchParams.set("per_page", String(input?.limit ?? 100));
            input?.include?.forEach((include) =>
              url.searchParams.append("include[]", include),
            );
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            if (!query.ok) {
              return {
                data: [
                  {
                    classification: "Canvas Not Linked",
                    original_name: "This is an issue on Catalyst :(",
                    data: {
                      missingAssignments: 0,
                    },
                  },
                ] as Return,
                nextCursor: 0,
              };
            }
            const courses = (((await query.json()) as Course[]) ?? [])?.map(
              (course) => ({
                ...course,
                original_name: course.original_name ?? course.name,
              }),
            );
            const nextCursor =
              Number(input?.cursor ?? 0) + Number(input?.limit ?? 10);

            const periodValues = await ctx.db
              .select()
              .from(scheduleValues)
              .where(eq(scheduleValues.userId, ctx.user.get?.id ?? ""));

            const userSettings = await ctx.db
              .select()
              .from(settings)
              .where(eq(settings.userId, ctx.user.get?.id ?? ""));

            const schoolPeriods = await ctx.db
              .select()
              .from(periods)
              .where(
                eq(
                  periods.schoolId,
                  userSettings.find((val) => val.key == "school_id")?.value ??
                    "",
                ),
              );

            const currentSchedule = await ctx.db
              .select()
              .from(scheduleDates)
              .where(
                and(
                  eq(
                    scheduleDates.schoolId,
                    userSettings.find((val) => val.key == "school_id")?.value ??
                      "",
                  ),
                  eq(
                    scheduleDates.date,
                    new Date(new Date().toDateString() + " 00:00:00 UTC"),
                  ),
                ),
              );

            const schedule = await ctx.db
              .select()
              .from(periodTimes)
              .where(
                eq(
                  periodTimes.scheduleId,
                  currentSchedule.find(
                    (val) => val.id == currentSchedule[0]?.id,
                  )?.scheduleId ?? "",
                ),
              );

            const updatedCourses = await Promise.all(
              courses?.map(async (course) => {
                let classification = "Not Available";
                try {
                  classification = (await unstable_cache(async () => {
                    const classificationRedis = createClient({
                      url: env.CLASSIFICATION_REST_API_URL,
                      token: env.CLASSIFICATION_REST_API_TOKEN,
                    });

                    try {
                      const classification = await classificationRedis.get(
                        String(course.id),
                      );

                      if (classification) {
                        return classification;
                      }
                    } catch (err) {
                      console.error(err);
                    }

                    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

                    const model = genAI.getGenerativeModel({
                      model: "gemini-1.5-flash",
                      systemInstruction: "return the output value",
                    });

                    const generationConfig = {
                      temperature: 1,
                      topP: 0.95,
                      topK: 64,
                      maxOutputTokens: 100,
                      stopSequences: ["input:", "\n"],
                      responseMimeType: "text/plain",
                    };

                    const input = [
                      ...courseClassificationDataset,
                      {
                        text: "input: " + course.original_name,
                      },
                      {
                        text: "output: ",
                      },
                    ];

                    let result;
                    try {
                      result = await model
                        .generateContent({
                          contents: [{ role: "user", parts: input }],
                          generationConfig,
                        })
                        .catch((err) => {
                          console.error(err);
                          return undefined;
                        });
                    } catch (err) {
                      // oops
                    }

                    const value = result?.response?.text() ?? "Not Available";

                    if (value != "Not Available") {
                      try {
                        await classificationRedis.set(String(course.id), value);
                      } catch (err) {
                        // oops
                      }
                    }

                    return value;
                  }, [
                    "courses",
                    "classifications",
                    String(course.id),
                  ])()) as string;
                } catch (err) {
                  // probably went over some limit
                  console.error(err);
                }

                let missingAssignments;

                try {
                  const assignmentURL = new URL(
                    `/api/v1/courses/${course.id}/students/submissions`,
                    ctx.user.canvas.url,
                  );

                  assignmentURL.searchParams.set("per_page", "100");
                  assignmentURL.searchParams.append("include[]", "assignment");

                  const assignmentsQuery = await fetch(assignmentURL, {
                    headers: {
                      Authorization: `Bearer ${ctx.user.canvas.token}`,
                    },
                  });

                  const submissionData =
                    (await assignmentsQuery.json()) as Submission[];

                  const missing = submissionData.filter(
                    (assignment) =>
                      (assignment.missing &&
                        assignment.assignment?.points_possible != 0) ||
                      (!assignment.excused &&
                        assignment.score == 0 &&
                        assignment.assignment?.points_possible != 0),
                  );

                  missingAssignments = missing.length;
                } catch (err) {
                  // something doesn't work
                }

                return {
                  ...course,
                  classification,
                  data: {
                    missingAssignments,
                  },
                  period: schoolPeriods.find(
                    (period) =>
                      period.periodId ==
                      periodValues.find((val) => Number(val.value) == course.id)
                        ?.periodId,
                  ),
                  time: schedule.find(
                    (time) =>
                      time.optionId ==
                      periodValues.find((val) => Number(val.value) == course.id)
                        ?.periodId,
                  ),
                };
              }),
            );

            return {
              data: updatedCourses.sort((a, b) =>
                (a.period?.periodOrder ?? 100000) >
                (b.period?.periodOrder ?? 100000)
                  ? 1
                  : -1,
              ) as Return,
              nextCursor,
            };
          },
          [
            ctx.user.get?.id ?? "0",
            input?.toString() ?? "{}",
            new Date(new Date().toDateString() + " 00:00:00 UTC").toString(),
            "courses",
          ],
          {
            revalidate: 60,
          },
        )();
      }),
  },
});

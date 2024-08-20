import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export interface Term {
  id: number;
  name: string;
  start_at: string | null;
  end_at: string | null;
}

export interface CourseProgress {
  requirement_count: number;
  requirement_completed_count: number;
  next_requirement_url: string;
  completed_at: string;
}

export interface CalendarLink {
  ics: string;
}

export interface Course {
  id: number;
  sis_course_id: string | null;
  uuid: string;
  integration_id: string | null;
  sis_import_id: number;
  name: string;
  course_code: string;
  original_name: string;
  workflow_state: string;
  account_id: number;
  root_account_id: number;
  enrollment_term_id: number;
  grading_periods: null;
  grading_standard_id: number;
  grade_passback_setting: string;
  created_at: string;
  start_at: string;
  end_at: string;
  locale: string;
  enrollments: null;
  total_students: number;
  calendar: CalendarLink | null;
  default_view: string;
  syllabus_body: string;
  needs_grading_count: number;
  term: Term | null;
  course_progress: CourseProgress | null;
  apply_assignment_group_weights: boolean;
  permissions: Record<string, boolean>;
  is_public: boolean;
  is_public_to_auth_users: boolean;
  public_syllabus: boolean;
  public_syllabus_to_auth: boolean;
  public_description: string;
  storage_quota_mb: number;
  storage_quota_used_mb: number;
  hide_final_grades: boolean;
  license: string;
  allow_student_assignment_edits: boolean;
  allow_wiki_comments: boolean;
  allow_student_forum_attachments: boolean;
  open_enrollment: boolean;
  self_enrollment: boolean;
  restrict_enrollments_to_course_dates: boolean;
  course_format: string;
  access_restricted_by_date: boolean;
  time_zone: string;
  blueprint: boolean;
  blueprint_restrictions: Record<string, boolean>;
  blueprint_restrictions_by_object_type: Record<
    string,
    Record<string, boolean>
  >;
  template: boolean;
}

export const canvasRouter = createTRPCRouter({
  courses: {
    list: publicProcedure
      .input(
        z
          .object({
            enrollment_state: z
              .enum(["active", "invited_or_pending", "completed"])
              .optional(),
            limit: z.number().max(100).optional(),
            cursor: z.string().optional(),
          })
          .optional(),
      )
      .query(async ({ input, ctx }) => {
        const url = new URL("/api/v1/courses", ctx.user.canvas.url);
        input?.enrollment_state
          ? url.searchParams.set("enrollment_state", input.enrollment_state)
          : null;
        url.searchParams.set("page", String(input?.cursor ?? 1));
        url.searchParams.set("per_page", String(input?.limit ?? 10));
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        return {
          data: ((await query.json()) as Course[]).map((course) => ({
            ...course,
            original_name: course.original_name ?? course.name,
          })),
          nextCursor: Number(input?.cursor ?? 0) + Number(input?.limit ?? 10),
        };
      }),
  },
});

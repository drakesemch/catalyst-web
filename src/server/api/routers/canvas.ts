import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { del, put } from "@vercel/blob";
import { env } from "@/env";
import { constructFile } from "@/lib/utils";
import { addDays } from "date-fns";
import { unstable_cache } from "next/cache";
import { createClient } from "@vercel/kv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { courseClassificationDataset } from "./catalyst/canvas";

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
  enrollments: Enrollment[] | null;
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
  classification?: string;
}

export interface Participant {
  id: number;
  display_name: string;
  avatar_image_url: string;
  html_url: string;
}

export interface Reply {
  id: number;
  user_id: number;
  parent_id: number | null;
  message: string;
  replies?: Reply[];
}

export interface View {
  id: number;
  user_id: number;
  parent_id: number | null;
  message: string;
  replies?: Reply[];
}

export interface Discussion {
  unread_entries: number[];
  entry_ratings: Record<number, number>;
  forced_entries: number[];
  participants: Participant[];
  view: View[];
}

export interface FileAttachment {
  "content-type": string;
  url: string;
  filename: string;
  display_name: string;
}

export interface Page {
  page_id: number;
  url: string;
  title: string;
  created_at: string;
  updated_at: string;
  hide_from_students: boolean;
  editing_roles: string;
  last_edited_by: null;
  body: string;
  published: boolean;
  publish_at: string;
  front_page: boolean;
  locked_for_user: boolean;
  lock_info: null;
  lock_explanation: string;
}

export interface PageRevision {
  revision_id: number;
  updated_at: string;
  latest: boolean;
  edited_by: null;
  url: string;
  title: string;
  body: string;
}

export interface DiscussionTopic {
  id: number;
  title: string;
  message: string;
  html_url: string;
  posted_at: string | null;
  last_reply_at: string | null;
  require_initial_post: boolean;
  user_can_see_posts: boolean;
  discussion_subentry_count: number;
  read_state: string;
  unread_count: number;
  subscribed: boolean;
  subscription_hold: string | null;
  assignment_id: number | null;
  delayed_post_at: string | null;
  published: boolean;
  lock_at: string | null;
  locked: boolean;
  pinned: boolean;
  locked_for_user: boolean;
  lock_info: null;
  lock_explanation: string | null;
  user_name: string;
  topic_children: number[];
  group_topic_children: number[];
  root_topic_id: number | null;
  podcast_url: string;
  discussion_type: string;
  group_category_id: number | null;
  attachments: FileAttachment[] | null;
  permissions: Permissions;
  allow_rating: boolean;
  only_graders_can_rate: boolean;
  sort_by_rating: boolean;
}

export interface Attachment {
  "content-type": string;
  url: string;
  filename: string;
  display_name: string;
}

export interface RecentReply {
  id: number;
  user_id: number;
  user_name: string;
  message: string;
  created_at: string;
}

export interface DiscussionEntry {
  id: number;
  user_id: number;
  user_name: string;
  message: string;
  read_state: string;
  forced_read_state: boolean;
  created_at: string;
  attachment?: Attachment;
  recent_replies?: RecentReply[];
  has_more_replies?: boolean;
}

export interface UserDisplay {
  id: number;
  short_name: string;
  avatar_image_url: string;
  html_url: string;
}

export interface AnonymousUserDisplay {
  anonymous_id: string;
  avatar_image_url: string;
  display_name: string;
}

export interface User {
  id: number;
  name: string;
  sortable_name: string;
  last_name: string;
  first_name: string;
  short_name: string;
  sis_user_id: string;
  sis_import_id: number;
  integration_id: string;
  login_id: string;
  avatar_url: string;
  avatar_state: string;
  enrollments: Enrollment[];
  email: string;
  locale: string;
  last_login: string;
  time_zone: string;
  bio: string;
  pronouns: string;
}

export interface Profile {
  id: number;
  name: string;
  short_name: string;
  sortable_name: string;
  title: string;
  bio: string;
  pronunciation: string;
  primary_email: string;
  login_id: string;
  sis_user_id: string;
  lti_user_id: number;
  avatar_url: string;
  calendar: null;
  time_zone: string;
  locale: string;
  k5_user: boolean;
  use_classic_font_in_k5: boolean;
}

export interface Avatar {
  type: string;
  url: string;
  token: string;
  display_name: string;
  id: number;
  content_type: string;
  filename: string;
  size: number;
}

export interface PageView {
  id: string;
  app_name: string;
  url: string;
  context_type: string;
  asset_type: string;
  controller: string;
  action: string;
  contributed: boolean;
  interaction_seconds: number;
  created_at: string;
  user_request: boolean;
  render_time: number;
  user_agent: string;
  participated: boolean;
  http_method: string;
  remote_ip: string;
  links: PageViewLinks;
}

export interface PageViewLinks {
  user: number;
  context: number;
  asset: number;
  real_user: number;
  account: number;
}

export interface CourseNickname {
  course_id: number;
  name: string;
  nickname: string;
}

export interface Grade {
  html_url: string;
  current_grade: string;
  final_grade: string;
  current_score: string;
  final_score: string;
  current_points: number;
  unposted_current_grade: string;
  unposted_final_grade: string;
  unposted_current_score: string;
  unposted_final_score: string;
  unposted_current_points: number;
}

export interface Enrollment {
  id: number;
  course_id: number;
  sis_course_id: string;
  course_integration_id: string;
  course_section_id: number;
  section_integration_id: string;
  sis_account_id: string;
  sis_section_id: string;
  sis_user_id: string;
  enrollment_state: string;
  limit_privileges_to_course_section: boolean;
  sis_import_id: number;
  root_account_id: number;
  type: string;
  user_id: number;
  associated_user_id: number;
  role: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  start_at: string;
  end_at: string;
  last_activity_at: string;
  last_attended_at: string;
  total_activity_time: number;
  html_url: string;
  grades: Grade;
  user: Profile;
  override_grade: string;
  override_score: number;
  unposted_current_grade: string;
  unposted_final_grade: string;
  unposted_current_score: string;
  unposted_final_score: string;
  has_grading_periods: boolean;
  computed_current_grade: number | null;
  computed_current_score: number | null;
  computed_current_letter_grade: number | string;
  computed_final_grade: number | null;
  computed_final_score: number | null;
  totals_for_all_grading_periods_option: boolean;
  current_grading_period_title: string;
  current_grading_period_id: number;
  current_period_override_grade: string;
  current_period_override_score: number;
  current_period_unposted_current_score: number;
  current_period_unposted_final_score: number;
  current_period_unposted_current_grade: string;
  current_period_unposted_final_grade: string;
}

export interface Module {
  id: number;
  workflow_state: string;
  position: number;
  name: string;
  unlock_at: string;
  require_sequential_progress: boolean;
  prerequisite_module_ids: number[];
  items_count: number;
  items_url: string;
  items: ModuleItem[] | null;
  state: string;
  completed_at: null;
  publish_final_grade: null;
  published: boolean;
}

export interface CompletionRequirement {
  type: string;
  min_score: number;
  completed: boolean;
}

export interface ContentDetails {
  points_possible: number;
  due_at: string;
  unlock_at: string;
  lock_at: string;
  locked_for_user: boolean;
  lock_explanation: string;
  lock_info: {
    asset_string: string;
    unlock_at: string;
    lock_at: string;
    context_module: object;
  };
}

export interface ModuleItem {
  id: number;
  module_id: number;
  position: number;
  title: string;
  indent: number;
  type: string;
  content_id: number;
  html_url: string;
  url: string;
  page_url: string;
  external_url: string;
  new_tab: boolean;
  completion_requirement: CompletionRequirement;
  content_details: ContentDetails | (ContentDetails & Assignment);
  published: boolean;
}

export interface ModuleItemSequenceNode {
  prev: null;
  current: ModuleItem;
  next: ModuleItem;
  mastery_path: {
    locked: boolean;
    assignment_sets: [];
    selected_set_id: null;
    awaiting_choice: boolean;
    still_processing: boolean;
    modules_url: string;
    choose_url: string;
    modules_tab_disabled: boolean;
  };
}

export interface ModuleItemSequence {
  items: ModuleItemSequenceNode[];
  modules: Module[];
}

export interface ModuleAssignmentOverride {
  id: number;
  context_module_id: number;
  title: string;
  students: null;
  course_section: null;
}

export interface OverrideTarget {
  id: number;
  name: string;
}

export interface ExternalToolTagAttributes {
  url: string;
  new_tab: boolean;
  resource_link_id: string;
}

export interface LockInfo {
  asset_string: string;
  unlock_at?: string;
  lock_at?: string;
  context_module?: string;
  manually_locked: boolean;
}

export interface RubricRating {
  points: number;
  id: string;
  description: string;
  long_description: string;
}

export interface RubricCriteria {
  points: number;
  id: string;
  learning_outcome_id?: string;
  vendor_guid?: string;
  description: string;
  long_description: string;
  criterion_use_range: boolean;
  ratings: RubricRating[] | null;
  ignore_for_scoring: boolean;
}

export interface AssignmentDate {
  id?: number;
  base?: boolean;
  title: string;
  due_at: string;
  unlock_at?: string;
  lock_at?: string;
}

export interface TurnitinSettings {
  originality_report_visibility:
    | "immediate"
    | "after_grading"
    | "after_due_date"
    | "never";
  s_paper_check: boolean;
  internet_check: boolean;
  journal_check: boolean;
  exclude_biblio: boolean;
  exclude_quoted: boolean;
  exclude_small_matches_type: "percent" | "words" | null;
  exclude_small_matches_value: number | null;
}

export interface NeedsGradingCount {
  section_id: string;
  needs_grading_count: number;
}

export interface ScoreStatistic {
  min: number;
  max: number;
  mean: number;
  upper_q: number;
  median: number;
  lower_q: number;
}

export interface Assignment {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  due_at: string | null;
  lock_at: string | null;
  unlock_at: string | null;
  has_overrides: boolean;
  all_dates: AssignmentDate[] | null;
  course_id: number;
  html_url: string;
  submissions_download_url: string;
  assignment_group_id: number;
  due_date_required: boolean;
  allowed_extensions: string[];
  max_name_length: number;
  turnitin_enabled?: boolean;
  vericite_enabled?: boolean;
  turnitin_settings?: TurnitinSettings | null;
  grade_group_students_individually: boolean;
  external_tool_tag_attributes?: ExternalToolTagAttributes | null;
  peer_reviews: boolean;
  automatic_peer_reviews: boolean;
  peer_review_count?: number;
  peer_reviews_assign_at?: string;
  intra_group_peer_reviews: boolean;
  group_category_id?: number;
  needs_grading_count: number;
  needs_grading_count_by_section?: NeedsGradingCount[];
  position: number;
  post_to_sis?: boolean;
  integration_id?: string;
  integration_data?: Record<string, null>;
  points_possible: number;
  submission_types: string[];
  has_submitted_submissions: boolean;
  grading_type:
    | "pass_fail"
    | "percent"
    | "letter_grade"
    | "gpa_scale"
    | "points";
  grading_standard_id?: number | null;
  published: boolean;
  unpublishable: boolean;
  only_visible_to_overrides: boolean;
  locked_for_user: boolean;
  lock_info?: LockInfo | null;
  lock_explanation?: string | null;
  quiz_id?: number;
  anonymous_submissions?: boolean;
  discussion_topic?: string | null;
  freeze_on_copy?: boolean;
  frozen?: boolean;
  frozen_attributes?: string[];
  submission?: Submission;
  use_rubric_for_grading?: boolean;
  rubric_settings?: Record<string, null>;
  rubric?: RubricCriteria[] | null;
  assignment_visibility?: number[];
  overrides?: AssignmentOverride[] | null;
  omit_from_final_grade?: boolean;
  hide_in_gradebook?: boolean;
  moderated_grading: boolean;
  grader_count: number;
  final_grader_id: number;
  grader_comments_visible_to_graders: boolean;
  graders_anonymous_to_graders: boolean;
  grader_names_visible_to_final_grader: boolean;
  anonymous_grading: boolean;
  allowed_attempts: number;
  post_manually: boolean;
  score_statistics?: ScoreStatistic | null;
  can_submit?: boolean;
  ab_guid?: string[];
  annotatable_attachment_id?: number | null;
  anonymize_students?: boolean;
  require_lockdown_browser?: boolean;
  important_dates?: boolean;
  muted?: boolean; // Deprecated
  anonymous_peer_reviews: boolean;
  anonymous_instructor_annotations: boolean;
  graded_submissions_exist: boolean;
  is_quiz_assignment: boolean;
  in_closed_grading_period: boolean;
  can_duplicate: boolean;
  original_course_id?: number;
  original_assignment_id?: number;
  original_lti_resource_link_id?: number;
  original_assignment_name?: string;
  original_quiz_id?: number;
  workflow_state: string;
}

export interface AssignmentOverride {
  id: number;
  assignment_id?: number;
  quiz_id?: number;
  context_module_id?: number;
  discussion_topic_id?: number;
}

export interface MediaComment {
  "content-type": string;
  display_name: string;
  media_id: string;
  media_type: string;
  url: string;
}

export interface SubmissionComment {
  id: number;
  author_id: number;
  author_name: string;
  author: string;
  comment: string;
  created_at: string;
  edited_at: string;
  media_comment: MediaComment | null;
}

export interface Submission {
  assignment_id: number;
  assignment: Assignment | null;
  course: Course | null;
  attempt: number;
  body: string;
  grade: string;
  grade_matches_current_submission: boolean;
  html_url: string;
  preview_url: string;
  score: number;
  submission_comments: SubmissionComment[] | null;
  submission_type: string;
  submitted_at: string;
  url: string | null;
  user_id: number;
  grader_id: number;
  graded_at: string;
  user: User | null;
  late: boolean;
  assignment_visible: boolean;
  excused: boolean;
  missing: boolean;
  late_policy_status: string;
  points_deducted: number;
  seconds_late: number;
  workflow_state: string;
  extra_attempts: number;
  anonymous_id: string;
  posted_at: string;
  read_status: string;
  redo_request: boolean;
  attachments?: FileAttachment[] | null;
}

export interface Conversation {
  id: number;
  subject: string;
  workflow_state: string;
  last_message: string;
  last_message_at: string;
  start_at: string;
  message_count: number;
  subscribed: boolean;
  private: boolean;
  starred: boolean;
  properties: null;
  audience: null;
  audience_contexts: null;
  avatar_url: string;
  participants: ConversationParticipant[] | null;
  visible: boolean;
  context_name: string;
}

export interface ConversationParticipant {
  id: number;
  name: string;
  full_name: string;
  avatar_url: string;
}

export interface ConversationDetailed {
  id: number;
  subject: string;
  workflow_state: string;
  last_message: string;
  last_message_at: string;
  message_count: number;
  subscribed: boolean;
  private: boolean;
  starred: boolean;
  properties: string[];
  audience: number[];
  context_name: string;
  audience_contexts: {
    courses: Record<string, number>;
    groups: Record<string, number>;
  };
  avatar_url: string;
  participants: ConversationParticipant[];
  messages: Message[];
  submissions: Submission[];
}

export interface Message {
  id: number;
  created_at: string;
  body: string;
  author_id: number;
  generated: boolean;
  media_comment: Comment | null;
  forwarded_messages: Message[];
  attachments: Attachment[];
}

export interface PlannerNote {
  id: number;
  title: string;
  description: string;
  user_id: number;
  workflow_state: string;
  course_id: number;
  todo_date: string;
  linked_object_type: string;
  linked_object_id: number;
  linked_object_html_url: string;
  linked_object_url: string;
}

export interface PlannerOverride {
  id: number;
  plannable_type: string;
  plannable_id: number;
  user_id: number;
  assignment_id: number;
  workflow_state: string;
  marked_complete: boolean;
  dismissed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Plannable {
  id: number;
  todo_date: string;
  title: string;
  details: string;
  user_id: number;
  course_id?: number;
  workflow_state: string;
  created_at: string;
  updated_at: string;
  content_details: Assignment;
}

export interface PlannerItem {
  context_type?: string;
  course_id?: number;
  course?: Course;
  planner_override?: PlannerOverride;
  submissions?: Submission[] | boolean;
  plannable_id: string;
  plannable_type: string;
  plannable: Plannable;
  html_url: string;
}

export interface GradingRules {
  drop_lowest: number;
  drop_highest: number;
  never_drop: number[];
}

export interface AssignmentGroup {
  id: number;
  name: string;
  position: number;
  group_weight: number;
  sis_source_id: string;
  integration_data: Record<string, string>;
  assignments: Assignment[];
  rules: GradingRules | null;
}

export const canvasRouter = createTRPCRouter({
  users: {
    self: protectedProcedure.query(async ({ ctx }) => {
      const url = new URL("/api/v1/users/self", ctx.user.canvas.url);
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      return (await query.json()) as User;
    }),
  },
  todo: {
    setCompleted: protectedProcedure
      .input(
        z.object({
          create: z.boolean(),
          type: z.string(),
          id: z.number(),
          completed: z.boolean(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (input.create) {
          const url = new URL("/api/v1/planner/overrides", ctx.user.canvas.url);
          const query = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              plannable_type: input.type,
              plannable_id: input.id,
              marked_complete: input.completed,
            }),
          });
          return query.json();
        } else {
          const url = new URL(
            `/api/v1/planner/overrides/${input.id}`,
            ctx.user.canvas.url,
          );
          console.log(input.id, input.completed);
          const query = await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              marked_complete: input.completed,
            }),
          });
          return query.json();
        }
      }),
    upcoming: protectedProcedure.query(async ({ ctx }) => {
      const url = new URL("/api/v1/planner/items", ctx.user.canvas.url);
      url.searchParams.append("start_date", new Date().toISOString());
      url.searchParams.append(
        "end_date",
        addDays(new Date(), 14).toISOString(),
      );
      const query = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ctx.user.canvas.token}`,
        },
      });
      const data = (await query.json()) as PlannerItem[];
      for (const item of data) {
        const courseURL = new URL(
          `/api/v1/courses/${item.course_id}`,
          ctx.user.canvas.url,
        );
        const courseQuery = await fetch(courseURL, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        const course = (await courseQuery.json()) as Course;
        const classification = (await unstable_cache(async () => {
          const classificationRedis = createClient({
            url: env.CLASSIFICATION_REST_API_URL,
            token: env.CLASSIFICATION_REST_API_TOKEN,
          });

          const classification = await classificationRedis.get(
            String(course.id),
          );

          if (classification) {
            return classification;
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

          const result = await model
            .generateContent({
              contents: [{ role: "user", parts: input }],
              generationConfig,
            })
            .catch((err) => {
              console.error(err);
              return undefined;
            });

          const value = result?.response?.text() ?? "Not Available";

          if (value != "Not Available") {
            await classificationRedis.set(String(course.id), value);
          }

          return value;
        }, ["courses", "classifications", String(course.id)])()) as string;
        item.course = { ...course, classification };
        if (item.plannable_type == "assignment") {
          const assignmentURL = new URL(
            `/api/v1/courses/${item.course_id}/assignments/${item.plannable.id}`,
            ctx.user.canvas.url,
          );
          assignmentURL.searchParams.append("include[]", "submission");
          const assignmentQuery = await fetch(assignmentURL, {
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
            },
          });
          item.plannable.content_details =
            (await assignmentQuery.json()) as Assignment;
        }
      }
      return data;
    }),
  },
  inbox: {
    list: protectedProcedure
      .input(
        z.object({
          cursor: z.number().optional(),
          limit: z.number().optional(),
        }),
      )
      .query(async ({ input, ctx }) => {
        const url = new URL("/api/v1/conversations", ctx.user.canvas.url);
        url.searchParams.append("include[]", "participants");
        url.searchParams.append("per_page", String(input?.limit ?? 10));
        url.searchParams.append("page", String(input?.cursor ?? 1));
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        return {
          data: (await query.json()) as Conversation[],
          nextCursor: Number((input.cursor ?? 0) + 1),
        };
      }),
    get: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input, ctx }) => {
        const url = new URL(
          `/api/v1/conversations/${input.conversationId}`,
          ctx.user.canvas.url,
        );
        url.searchParams.append("include_private", "true");
        url.searchParams.append("include", "participants");
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        return (await query.json()) as ConversationDetailed;
      }),
    reply: protectedProcedure
      .input(
        z.object({
          conversationId: z.number(),
          body: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const url = new URL(
          `/api/v1/conversations/${input.conversationId}/add_message`,
          ctx.user.canvas.url,
        );
        const query = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: input.body,
          }),
        });
        return query.json();
      }),
  },
  courses: {
    list: protectedProcedure
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
        url.searchParams.set("per_page", String(input?.limit ?? 100));
        const query = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ctx.user.canvas.token}`,
          },
        });
        let data = (await query.json()) as Course[];
        data = data?.map?.((course) => ({
          ...course,
          original_name: course.original_name ?? course.name,
        }));
        return {
          data: data,
          nextCursor: Number(input?.cursor ?? 0) + Number(input?.limit ?? 10),
        };
      }),
    get: {
      details: protectedProcedure
        .input(z.object({ courseId: z.number() }))
        .query(async ({ input, ctx }) => {
          const url = new URL(
            `/api/v1/courses/${input.courseId}`,
            ctx.user.canvas.url,
          );
          const query = await fetch(url, {
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
            },
          });
          const data = (await query.json()) as Course;
          const classification = (await unstable_cache(async () => {
            const classificationRedis = createClient({
              url: env.CLASSIFICATION_REST_API_URL,
              token: env.CLASSIFICATION_REST_API_TOKEN,
            });

            const classification = await classificationRedis.get(
              String(data.id),
            );

            if (classification) {
              return classification;
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
                text: "input: " + data.original_name,
              },
              {
                text: "output: ",
              },
            ];

            const result = await model
              .generateContent({
                contents: [{ role: "user", parts: input }],
                generationConfig,
              })
              .catch((err) => {
                console.error(err);
                return undefined;
              });

            const value = result?.response?.text() ?? "Not Available";

            if (value != "Not Available") {
              await classificationRedis.set(String(data.id), value);
            }

            return value;
          }, ["courses", "classifications", String(data.id)])()) as string;
          return {
            ...data,
            original_name: data.original_name ?? data.name,
            classification,
          };
        }),
      people: protectedProcedure
        .input(z.object({ courseId: z.number() }))
        .query(async ({ input, ctx }) => {
          const url = new URL(
            `/api/v1/courses/${input.courseId}/users`,
            ctx.user.canvas.url,
          );
          url.searchParams.append("include[]", "avatar_url");
          url.searchParams.append("include[]", "enrollments");
          url.searchParams.append("limit", "100");
          const query = await fetch(url, {
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
            },
          });
          return (await query.json()) as User[];
        }),
      grades: {
        list: protectedProcedure
          .input(z.object({ courseId: z.number() }))
          .query(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/assignments`,
              ctx.user.canvas.url,
            );
            url.searchParams.append("per_page", "1000");
            url.searchParams.append("include[]", "submission");
            url.searchParams.append("include[]", "score_statistics");
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            if (!query.ok) return [];
            return (await query.json()) as Assignment[];
          }),
        groups: protectedProcedure
          .input(z.object({ courseId: z.number() }))
          .query(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/assignment_groups`,
              ctx.user.canvas.url,
            );
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            return (await query.json()) as AssignmentGroup[];
          }),
      },
      frontPage: protectedProcedure
        .input(z.object({ courseId: z.number() }))
        .query(async ({ input, ctx }) => {
          const url = new URL(
            `/api/v1/courses/${input.courseId}/front_page`,
            ctx.user.canvas.url,
          );
          const query = await fetch(url, {
            headers: {
              Authorization: `Bearer ${ctx.user.canvas.token}`,
            },
          });
          return (await query.json()) as Page;
        }),
      pages: {
        get: protectedProcedure
          .input(z.object({ courseId: z.number(), pageId: z.string() }))
          .query(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/pages/${input.pageId}`,
              ctx.user.canvas.url,
            );
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            return (await query.json()) as Page;
          }),
      },
      assignments: {
        submissions: {
          list: protectedProcedure
            .input(
              z.object({
                courseId: z.number(),
                assignmentId: z.number(),
              }),
            )
            .query(async ({ input, ctx }) => {
              const url = new URL(
                `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions/self`,
                ctx.user.canvas.url,
              );
              url.searchParams.append("include[]", "submission_history");
              url.searchParams.append("include[]", "submission_comments");
              url.searchParams.append("include[]", "user");
              const query = await fetch(url, {
                headers: {
                  Authorization: `Bearer ${ctx.user.canvas.token}`,
                },
              });
              const data = (await query.json()) as {
                submission_history: Submission[];
              };
              return data.submission_history;
            }),
        },
        submit: {
          files: protectedProcedure
            .input(
              z.object({
                courseId: z.number(),
                assignmentId: z.number(),
                files: z.array(
                  z.object({
                    name: z.string(),
                    data: z.string(),
                  }),
                ),
              }),
            )
            .mutation(async ({ input, ctx }) => {
              const fileIds: number[] = [];
              for (const fileInput of input.files) {
                const data = new FormData();
                const file = constructFile(fileInput.data, fileInput.name);
                const blob = await put(`uploads/${file.name}`, file, {
                  access: "public",
                  token: env.BLOB_TOKEN,
                });
                data.append("url", blob.url);
                data.append("name", file.name);
                data.append("size", file.size.toString());
                data.append("content_type", file.type);

                const res = await fetch(
                  new URL(
                    `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions/self/files`,
                    ctx.user.canvas.url,
                  ),
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${ctx.user.canvas.token}`,
                    },
                    body: data,
                  },
                );
                if (!res.ok) {
                  console.error(
                    "Error Uploading to Assignment",
                    res.status,
                    res.statusText,
                    await res.json(),
                  );
                  return { success: false, response: null };
                }
                const response = (await res.json()) as
                  | {
                      upload_url: string;
                      upload_params: Record<string, string>;
                      id: undefined;
                    }
                  | { upload_url: undefined; id: number };
                if (response?.upload_url) {
                  const uploadData = new FormData();
                  uploadData.append("target_url", blob.url);
                  uploadData.append("filename", file.name);
                  uploadData.append("content_type", file.type);
                  const upload = await fetch(response.upload_url, {
                    method: "POST",
                    body: uploadData,
                  });
                  if (!upload.ok)
                    return {
                      success: false,
                      response: "Error Uploading to New Assignment Endpoint",
                    };
                  const uploadResponse = (await upload.json()) as {
                    id: number;
                  };
                  fileIds.push(uploadResponse?.id);
                } else {
                  fileIds.push(response?.id ?? 0);
                }
                await del(blob.url);
              }
              const submitURL = new URL(
                `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions`,
                ctx.user.canvas.url,
              );
              submitURL.searchParams.append(
                "submission[submission_type]",
                "online_upload",
              );
              fileIds.forEach((id) =>
                submitURL.searchParams.append(
                  "submission[file_ids][]",
                  String(id),
                ),
              );
              const response = await fetch(submitURL, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${ctx.user.canvas.token}`,
                },
              });

              return {
                success: response.ok,
                response: (await response.json()) as Submission,
              };
            }),
          text: protectedProcedure
            .input(
              z.object({
                courseId: z.number(),
                assignmentId: z.number(),
                body: z.string(),
              }),
            )
            .mutation(async ({ input, ctx }) => {
              const url = new URL(
                `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}/submissions`,
                ctx.user.canvas.url,
              );
              const data = new FormData();
              data.append("submission[submission_type]", "online_text_entry");
              data.append("submission[body]", input.body);
              const query = await fetch(url, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${ctx.user.canvas.token}`,
                },
                body: data,
              });
              return query.json();
            }),
        },
        get: protectedProcedure
          .input(z.object({ courseId: z.number(), assignmentId: z.number() }))
          .query(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/assignments/${input.assignmentId}`,
              ctx.user.canvas.url,
            );
            url.searchParams.append("include[]", "submission");
            url.searchParams.append("include[]", "score_statistics");
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            const response = (await query.json()) as Assignment;
            if (response.submission_types.includes("external_tool")) {
              const externalURL = new URL(
                `/api/v1/courses/${input.courseId}/external_tools/sessionless_launch`,
                ctx.user.canvas.url,
              );
              externalURL.searchParams.append(
                "assignment_id",
                String(input.assignmentId),
              );
              externalURL.searchParams.append("launch_type", "assessment");
              const externalResponse = await fetch(externalURL, {
                headers: {
                  Authorization: `Bearer ${ctx.user.canvas.token}`,
                },
              });
              response.external_tool_tag_attributes =
                (await externalResponse.json()) as ExternalToolTagAttributes;
            }
            return response;
          }),
        list: protectedProcedure
          .input(z.object({ courseId: z.number() }))
          .query(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/assignments`,
              ctx.user.canvas.url,
            );
            url.searchParams.append("per_page", "1000");
            url.searchParams.append("include[]", "submission");
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            if (!query.ok) return [];
            return (await query.json()) as Assignment[];
          }),
      },
      modules: {
        get: protectedProcedure
          .input(z.object({ courseId: z.number() }))
          .query(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/modules`,
              ctx.user.canvas.url,
            );
            url.searchParams.append("include[]", "items");
            url.searchParams.append("include[]", "content_details");
            const query = await fetch(url, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });
            if (!query.ok) return [];
            let json = ((await query.json()) ?? []) as Module[];
            json = (await Promise.all(
              json.map(async (module) => ({
                ...module,
                items: await Promise.all(
                  module.items?.map(async (item) => {
                    if (item.type == "Assignment") {
                      const assignmentURL = new URL(
                        `/api/v1/courses/${input.courseId}/assignments/${item.content_id}`,
                        ctx.user.canvas.url,
                      );
                      assignmentURL.searchParams.append(
                        "include[]",
                        "submission",
                      );
                      const assignmentQuery = await fetch(assignmentURL, {
                        headers: {
                          Authorization: `Bearer ${ctx.user.canvas.token}`,
                        },
                      });
                      const assignmentData =
                        (await assignmentQuery.json()) as Assignment;
                      return {
                        ...item,
                        content_details: {
                          ...item.content_details,
                          ...assignmentData,
                        },
                      };
                    } else if (item.type == "File") {
                      const fileURL = new URL(
                        `/api/v1/courses/${input.courseId}/files/${item.content_id}`,
                        ctx.user.canvas.url,
                      );
                      const fileQuery = await fetch(fileURL, {
                        headers: {
                          Authorization: `Bearer ${ctx.user.canvas.token}`,
                        },
                      });
                      const fileData = (await fileQuery.json()) as File;
                      return {
                        ...item,
                        content_details: {
                          ...item.content_details,
                          ...fileData,
                        },
                      };
                    } else if (item.type == "Discussion") {
                      const assignmentURL = new URL(
                        `/api/v1/courses/${input.courseId}/discussion_topics/${item.content_id}`,
                        ctx.user.canvas.url,
                      );
                      assignmentURL.searchParams.append(
                        "include[]",
                        "submission",
                      );
                      const assignmentQuery = await fetch(assignmentURL, {
                        headers: {
                          Authorization: `Bearer ${ctx.user.canvas.token}`,
                        },
                      });
                      const assignmentData =
                        (await assignmentQuery.json()) as DiscussionTopic;
                      return {
                        ...item,
                        content_details: {
                          ...item.content_details,
                          ...assignmentData,
                        },
                      };
                    }
                    return item;
                  }) ?? [],
                ),
              })),
            )) as Module[];
            return json;
          }),
      },
      discussions: {
        edit: protectedProcedure
          .input(
            z.object({
              courseId: z.number(),
              discussionId: z.number(),
              messageId: z.number(),
              body: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/discussion_topics/${input.discussionId}/entries/${input.messageId}`,
              ctx.user.canvas.url,
            );
            const query = await fetch(url, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: input.body,
              }),
            });
            return query.json();
          }),
        post: protectedProcedure
          .input(
            z.object({
              courseId: z.number(),
              discussionId: z.number(),
              body: z.string(),
            }),
          )
          .mutation(async ({ input, ctx }) => {
            const url = new URL(
              `/api/v1/courses/${input.courseId}/discussion_topics/${input.discussionId}/entries`,
              ctx.user.canvas.url,
            );
            const query = await fetch(url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: input.body,
              }),
            });
            return query.json();
          }),
        get: protectedProcedure
          .input(
            z.object({
              courseId: z.number(),
              discussionId: z.number(),
              limit: z.number().optional(),
            }),
          )
          .query(async ({ input, ctx }) => {
            const detailURL = new URL(
              `/api/v1/courses/${input.courseId}/discussion_topics/${input.discussionId}`,
              ctx.user.canvas.url,
            );
            const detailQuery = await fetch(detailURL, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });

            const summariesURL = new URL(
              `/api/v1/courses/${input.courseId}/discussion_topics/${input.discussionId}/view`,
              ctx.user.canvas.url,
            );

            summariesURL.searchParams.set(
              "per_page",
              String(input.limit ?? 10),
            );

            const summariesQuery = await fetch(summariesURL, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });

            const responsesURL = new URL(
              `/api/v1/courses/${input.courseId}/discussion_topics/${input.discussionId}/entries`,
              ctx.user.canvas.url,
            );

            responsesURL.searchParams.set(
              "per_page",
              String(input.limit ?? 10),
            );

            const responsesQuery = await fetch(responsesURL, {
              headers: {
                Authorization: `Bearer ${ctx.user.canvas.token}`,
              },
            });

            const response = {
              ...(await detailQuery.json()),
              ...(await summariesQuery.json()),
              entries: (await responsesQuery.json()) as DiscussionEntry[],
            } as DiscussionTopic & Discussion & { entries: DiscussionEntry[] };

            return response;
          }),
      },
    },
  },
});

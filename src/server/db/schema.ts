import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  pgEnum as varenum,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const proUsers = createTable("pro_user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires", {
    mode: "date",
  }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

////////////////////////////////////////

export const settingState = varenum("setting_state", ["draft", "saved"]);
export const periodType = varenum("period_type", [
  "single",
  "course",
  "filler",
]);
export const permissionRole = varenum("permission_role", [
  "owner",
  "manager",
  "viewer",
]);

export const settings = createTable(
  "setting",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    value: text("value"),
    draftState: settingState("setting_state"),
  },
  (setting) => ({
    keyIdx: index("setting_key_idx").on(setting.key),
  }),
);

export const settingsToUserRelation = relations(settings, ({ one }) => ({
  user: one(users, { fields: [settings.userId], references: [users.id] }),
}));

export const userToSettingsRelation = relations(users, ({ many }) => ({
  settings: many(settings),
}));

export const schools = createTable(
  "school",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 32 }),
    district: varchar("district", { length: 32 }),
    address: text("address"),
    city: varchar("city", { length: 32 }),
    state: varchar("state", { length: 2 }),
    draftState: settingState("setting_state"),
    canvasURL: varchar("canvas_url", { length: 255 }),
    isPublic: boolean("is_public"),
  },
  (school) => ({
    nameIdx: index("school_name_idx").on(school.name),
    districtIdx: index("school_district_idx").on(school.district),
  }),
);

export const schoolPermissions = createTable(
  "school_permission",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 })
      .notNull()
      .references(() => schools.id),
    userId: varchar("user_id", { length: 255 }).notNull(),
    role: varchar("role", { length: 32 }).notNull(),
  },
  (schoolPermission) => ({
    schoolIdIdx: index("school_permission_school_id_idx").on(
      schoolPermission.schoolId,
    ),
    userIdIdx: index("school_permission_user_id_idx").on(
      schoolPermission.userId,
    ),
  }),
);

export const periods = createTable(
  "period",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    periodId: varchar("period_id", { length: 255 })
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    optionId: varchar("option_id", { length: 255 })
      .notNull()
      .unique()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 }).notNull(),
    periodName: varchar("periodName", { length: 32 }).notNull(),
    optionName: varchar("optionName", { length: 32 }).notNull(),
    type: periodType("period_type"),
    periodOrder: integer("period_order"),
    optionOrder: integer("option_order"),
    draftState: settingState("setting_state"),
  },
  (period) => ({
    periodIdIdx: index("period_period_id_idx").on(period.periodId),
    optionIdIdx: index("period_option_id_idx").on(period.optionId),
    schoolIdIdx: index("period_school_id_idx").on(period.schoolId),
  }),
);

export const schedules = createTable("schedule", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: varchar("school_id", { length: 255 }),
  name: varchar("name", { length: 32 }).notNull(),
  draftState: settingState("setting_state"),
});

export const periodTimes = createTable(
  "period_time",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 }).notNull(),
    optionId: varchar("option_id", { length: 255 }).notNull(),
    order: integer("order").notNull(),
    scheduleId: varchar("schedule_id", { length: 255 }).notNull(),
    start: varchar("start").notNull(),
    end: varchar("end").notNull(),
  },
  (periodTime) => ({
    optionIdIdx: index("period_time_option_id_idx").on(periodTime.optionId),
    scheduleIdIdx: index("period_time_schedule_id_idx").on(
      periodTime.scheduleId,
    ),
  }),
);

export const periodTimeToScheduleRelation = relations(
  periodTimes,
  ({ one }) => ({
    schedule: one(schedules, {
      fields: [periodTimes.scheduleId],
      references: [schedules.id],
    }),
  }),
);

export const periodTimeToPeriodRelation = relations(periodTimes, ({ one }) => ({
  period: one(periods, {
    fields: [periodTimes.optionId],
    references: [periods.optionId],
  }),
}));

export const scheduleValues = createTable(
  "schedule_value",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).notNull(),
    periodId: varchar("period_id", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
  },
  (scheduleValue) => ({
    userIdIdx: index("schedule_value_user_id_idx").on(scheduleValue.userId),
    periodIdIdx: index("schedule_value_period_id_idx").on(
      scheduleValue.periodId,
    ),
  }),
);

export const scheduleDates = createTable(
  "schedule_date",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    schoolId: varchar("school_id", { length: 255 }).notNull(),
    scheduleId: varchar("schedule_id", { length: 255 }).notNull(),
    date: timestamp("date", {
      mode: "date",
    }).notNull(),
    draftState: settingState("setting_state"),
  },
  (scheduleDate) => ({
    schoolIdIdx: index("schedule_date_school_id_idx").on(scheduleDate.schoolId),
  }),
);

export const scheduleDateToScheduleRelation = relations(
  scheduleDates,
  ({ one }) => ({
    schedule: one(schedules, {
      fields: [scheduleDates.scheduleId],
      references: [schedules.id],
    }),
  }),
);

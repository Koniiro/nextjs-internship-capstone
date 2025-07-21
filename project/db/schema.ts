import { integer, pgTable, varchar,text,timestamp,boolean,jsonb, primaryKey } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
export const teamTable = pgTable("team", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),

});




export const projectTable = pgTable("project", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  teamID:integer('team_id').notNull().references(()=>teamTable.id, {onDelete: 'cascade'}),
  name: varchar({ length: 255 }).notNull()

});
export const columnTable = pgTable("column", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectID: integer("project_id").notNull().references(() => projectTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull(), // e.g. "To Do", "In Progress"
  order: integer("order").default(0), // controls column order
});

export const taskTable = pgTable("task", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectID:integer('project_ID').notNull().references(()=>projectTable.id, {onDelete: 'cascade'}),
  assignedUserID:integer('assigned_user_ID').references(()=>usersTable.id, {onDelete: 'cascade'}),
  name: varchar({ length: 255 }).notNull(),
  description:text("description"),
  column_id: integer("column_id").notNull().references(() => columnTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  order: integer("order").default(0),
  metadata: jsonb("metadata").default({})



});
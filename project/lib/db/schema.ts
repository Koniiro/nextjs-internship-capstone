// TODO: Task 3.1 - Design database schema for users, projects, lists, and tasks
// TODO: Task 3.3 - Set up Drizzle ORM with type-safe schema definitions

/*
TODO: Implementation Notes for Interns:

1. Install Drizzle ORM dependencies: 
   - drizzle-orm
   - drizzle-kit
   - @vercel/postgres (if using Vercel Postgres)
   - OR pg + @types/pg (if using regular PostgreSQL)

2. Define schemas for:
   - users (id, clerkId, email, name, createdAt, updatedAt)
   - projects (id, name, description, ownerId, createdAt, updatedAt, dueDate)
   - lists (id, name, projectId, position, createdAt, updatedAt)
   - tasks (id, title, description, listId, assigneeId, priority, dueDate, position, createdAt, updatedAt)
   - comments (id, content, taskId, authorId, createdAt, updatedAt)

3. Set up proper relationships between tables
4. Add indexes for performance
5. Configure migrations

Example structure:
import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ... other tables
*/

import { integer, pgTable, varchar,text,timestamp,boolean,jsonb, primaryKey } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: text('clerk_id').notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  teamId: integer("team_id").references(() => teamTable.id),
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
export const columnTable = pgTable("kbColumn", {
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

export const lists = "TODO: Implement lists table schema"

export const comments = "TODO: Implement comments table schema"

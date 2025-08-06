import { relations } from "drizzle-orm";
import { projectTable,projectMembers, usersTable } from './schema';

export const projectRelation=relations(projectTable,({ many }) => ({
  members: many(projectMembers),
}));
export const userRelations = relations(usersTable, ({ many }) => ({
  projectMemberships: many(projectMembers),
}));

export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
  user: one(usersTable, {
    fields: [projectMembers.userId],
    references: [usersTable.id],
  }),
  project: one(projectTable, {
    fields: [projectMembers.projectId],
    references: [projectTable.id],
  }),
}));
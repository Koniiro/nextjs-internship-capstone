// TODO: Task 3.2 - Configure PostgreSQL database (Vercel Postgres or Neon)
// TODO: Task 3.5 - Implement database connection and query utilities

/*
TODO: Implementation Notes for Interns:

1. Choose database provider:
   - Vercel Postgres (recommended for Vercel deployment)
   - Neon (good alternative)
   - Local PostgreSQL for development

2. Set up environment variables:
   - DATABASE_URL
   - POSTGRES_URL (if using Vercel Postgres)

3. Configure Drizzle connection
4. Implement CRUD operations for all entities
5. Add proper error handling
6. Set up connection pooling if needed

Example structure:
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

export const db = drizzle(sql, { schema })

export const queries = {
  projects: {
    getAll: async () => { ... },
    getById: async (id: string) => { ... },
    create: async (data: any) => { ... },
    update: async (id: string, data: any) => { ... },
    delete: async (id: string) => { ... },
  },
  // ... other entity queries
}
*/


import {config} from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/db/schema';
import { ProjectCreator } from "@/types";
import { projectMembers, projectTable } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

config({path:".env"});
export const db = drizzle(process.env.DATABASE_URL!,{schema});

export const queries = {
  users:{
    getById: async (clerkId: string) => {
        return await db.query.usersTable.findFirst({
        where: (u, { eq }) => eq(u.clerkId, clerkId),
      });
    },

  },
  projects: {
    getAll: async () => {
      return await db.select().from(projectTable);
    },
    getByUser:async(userId: string)=>{
      return  await db.query.projectMembers.findMany({
          where: (pm, { eq }) => eq(pm.userId, userId),
          with: {
            project: true,
          },
      });
    },
    getById: async (projectId: string) => {
      const result = await db
          .select()
          .from(projectTable)
          .where(eq(projectTable.id, projectId))
          .limit(1); 

      return result[0] ?? null;
    },
    create: async (projectOwner:string,projectData:ProjectCreator) => {
      const data={
        projectOwner:projectOwner,
        name:projectData.name,
        statusId:projectData.statusId,
        description:projectData.description,
        color:projectData.color,
        due_date:projectData.dueDate
      }

      const newProject=await db.insert(projectTable).values(data).returning()
      return newProject
    },
    projectUserLink:async (projectId:string, userId:string,role:string)=>{
        try {
          await db.insert(projectMembers).values({
            userId,
            projectId,
            role,
          });
          return true; // success
        } catch (error) {
          console.error("Error linking user to project:", error);
          return false; // failure
        }
    },
    update: (id: string, projectData: ProjectCreator) => {
      return db.update(projectTable)
        .set({
          name:projectData.name,
          description:projectData.description,
          color:projectData.color,
          due_date:projectData.dueDate,
          statusId:projectData.statusId,
          updated_at:sql`now()`
        }).where(eq(projectTable.id,id));
    },
    delete: async (id: string) => {
      const res =await  db.delete(projectTable).where(eq(projectTable.id,id)).returning({ deletedId: projectTable.id});; 
      return res
    },
  },
  tasks: {
    getByProject: (projectId: string) => {
      console.log(`TODO: Task 4.4 - Get tasks for project ${projectId}`)
      return []
    },
    create: (data: any) => {
      console.log("TODO: Create task", data)
      return null
    },
    update: (id: string, data: any) => {
      console.log(`TODO: Update task ${id}`, data)
      return null
    },
    delete: (id: string) => {
      console.log(`TODO: Delete task ${id}`)
      return null
    },
  },
}

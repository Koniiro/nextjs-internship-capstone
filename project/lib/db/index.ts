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
import { createProject, getProjects } from "@/actions/project_actions";
import { ProjectCreator } from "@/types";
import { NextResponse } from 'next/server'


config({path:".env"});
export const db = drizzle(process.env.DATABASE_URL!,{schema});
/*
export const queries = {
  projects: {
    getAll: async () => {
      return await getProjects();
    },
    getById: (id: string) => {
      console.log(`TODO: Get project by ID: ${id}`)
      return null
    },
    create: async (data: ProjectCreator) => {
      try {
        const result = await createProject(data.name,data.description,data.color,data.dueDate)
        return NextResponse.json({ success: true, data: result });
      } catch (err) {
        console.error("Failed to create project:", err);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
      }
    },
    update: (id: string, data: any) => {
      console.log(`TODO: Update project ${id}`, data)
      return null
    },
    delete: (id: string) => {
      console.log(`TODO: Delete project ${id}`)
      return null
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
*/
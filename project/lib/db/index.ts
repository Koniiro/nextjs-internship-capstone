


import {config} from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/db/schema';
import { ColumnCreate, CommentCreate, ProjectCreator, Task, TaskCreate, UserCreator } from "@/types";
import { columnTable,usersTable, projectMembers, projectTable, taskTable, commentsTable } from "@/lib/db/schema";
import { asc, eq, sql } from "drizzle-orm";

config({path:".env"});
export const db = drizzle(process.env.DATABASE_URL!,{schema});

export const queries = {
  users:{
    getByClerkId: async (clerkId: string) => {
        const result = await  db
          .select()
          .from(usersTable)
          .where(eq(usersTable.clerkId, clerkId))
          .limit(1); 
        return result[0] ?? null;
    },
    getById: async (id: string) => {
        const result = await  db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, id))
          .limit(1); 
        return result[0] ?? null;
    },
    createUser: async (userData:UserCreator)=>{
      return db.insert(usersTable).values(userData).onConflictDoNothing().returning()
    },
    updateUser: (id: string, userData:UserCreator) => {
      return db.update(usersTable)
        .set({
          email: userData.email,
          userName: userData.userName,
          firstName:userData.first_name,
          lastName: userData.last_name,
          avatarURL:userData.avatar_url,
          updatedAt:sql`now()`
        }).where(eq(usersTable.id,id));
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

      const newProject=await db.insert(projectTable).values(data).onConflictDoNothing().returning()
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
      const res =await  db.delete(projectTable).where(eq(projectTable.id,id)).returning({ deletedId: projectTable.id});
      return res
    },
  },
  tasks: {
    //Auto orders by position

    getByProj: async (projectId:string):Promise<Task[]> =>{
      return await db.select({
        id:taskTable.id,
        columnId: taskTable.columnId,
        assigneeId: taskTable.assigneeId,
        title: taskTable.title,
        description: taskTable.description ,
        priority: taskTable.priority,
        position: taskTable.position,
        created_at: taskTable.created_at,
        updated_at: taskTable.updated_at,
        due_date: taskTable.due_date,
        openStatus:taskTable.openStatus

      }).from(taskTable)
      .innerJoin(columnTable,eq(taskTable.columnId,columnTable.id))
      .where(eq(columnTable.projectId,projectId))
    },

    getByCol: async(colId:number)=>{
      return db.query.taskTable.findMany({
        where:eq(taskTable.columnId,colId),
        orderBy:[asc(taskTable.position)]
      })
    },
    create: async (data: TaskCreate) => {
      return db.insert(taskTable).values(data).onConflictDoNothing().returning()
    },
    update: (id: number, data: TaskCreate) => {
      return db.update(taskTable)
        .set({
          title:data.title,
          columnId:data.columnId,
          description:data.description,
          priority:data.priority,
          position:data.position,
          due_date:data.due_date,
          updated_at:sql`now()`,

        }).where(eq(taskTable.id,id));
    },
    delete: (id: number) => {
      return db.delete(taskTable).where(eq(taskTable.id,id)).returning({ deletedId: taskTable.id});
    },
    
  },

  cols:{
    //Auto Orders by position
    getByProject: async(projectId: string) => {
      return db.query.columnTable.findMany({
        where:eq(columnTable.projectId,projectId),
        orderBy:[asc(columnTable.position)]
      })
    },
    create: async(colData: ColumnCreate)=>{
      const newProject=await db.insert(columnTable).values(colData).onConflictDoNothing().returning()
      return newProject 
    },
    update: (colId: number,  colData: ColumnCreate) => {
      return db.update(columnTable)
        .set({
          name:colData.name,
          description:colData.description,
          position:colData.position,
          color:colData.color,
          updated_at:sql`now()`
        }).where(eq(columnTable.id,colId));
    },
    delete: async (colId: number) => {
      const res =await  db.delete(columnTable).where(eq(columnTable.id,colId)).returning({ deletedId: projectTable.id});
      return res
    },

  },

  comments:{
    getById: async(commentId:string)=>{
      return await db
          .select()
          .from(commentsTable)
          .where(eq(commentsTable.id, commentId))
          .limit(1); 
    },
    getByTask: async(taskId:number)=>{
      return db.query.commentsTable.findMany({
        where:eq(commentsTable.task_id,taskId),
        orderBy:[asc(columnTable.created_at)]
      })
    },

    create: async (authorId:string,commentData: CommentCreate) => {
      const data={
        author_id:authorId,
        content:commentData.content,
        task_id:commentData.task_id
      }

      return db.insert(commentsTable).values(data).onConflictDoNothing().returning()
    },
    delete: (id: string) => {
      return db.delete(commentsTable).where(eq(commentsTable.id,id)).returning({ deletedId: commentsTable.id});
    },
  }


}

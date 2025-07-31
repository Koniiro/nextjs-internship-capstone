"use server";
import 'dotenv/config';

import { eq } from "drizzle-orm";
import { db } from '../lib/db/index';
import { projectMembers, projectTable } from '../lib/db/schema';

export const createProject=async (
  userID:string,
  name:string,
  description:string,
  color: string,
  dueDate: Date,

)=>{
  const [newProject] =await db.insert(projectTable).values({
    projectOwner:userID,
    name:name,
    description:description,
    statusId:5,
    due_date:dueDate,
    color:color
  }).returning();
  await db.insert(projectMembers).values({
    userId:userID,
    projectId:newProject.id,
    role:"Project Owner",
  })

  return { success: true }

}
"use server";
import 'dotenv/config';

import { eq } from "drizzle-orm";
import { db } from '../lib/db/index';
import { projectMembers, projectTable, usersTable } from '../lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const createProject=async (

  name:string,
  description:string|undefined,
  color: string|undefined,
  dueDate: Date|undefined,

)=>{
  const clerkID=  (await auth()).userId
  if (!clerkID) {
     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }


  // Get internal user UUID from your `usersTable`
  const internalUser = await db.query.usersTable.findFirst({
    where: (u, { eq }) => eq(u.clerkId, clerkID),
  });

  if (!internalUser) {
    throw new Error("User not found.");
  }
  
  const [newProject] =await db.insert(projectTable).values({
    projectOwner:internalUser.id,
    name:name,
    description:description,
    statusId:5,
    due_date:dueDate,
    color:color
  }).returning();

  await db.insert(projectMembers).values({
    userId:internalUser.id,
    projectId:newProject.id,
    role:"Project Owner",
  })

  return { success: true }

}
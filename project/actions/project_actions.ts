"use server";
import 'dotenv/config';

import { eq } from "drizzle-orm";
import { db } from '../lib/db/index';
import { projectMembers, projectTable, usersTable, } from '../lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Project } from '@/types';

export const getProjects = async()=>{
  try{
    const projects = await db.select().from(projectTable) 
    return { success: true, data:projects}
  }catch (e){
    console.error("Error fetching projects:", e);

    return {
      success: false,
      error: "Failed to fetch projects",
    };
  }
  
}

export const getUserProjects=async(): Promise<
  | { success: true; projects: Project[] }
  | { success: false; error: string }
>=>{
try {
    const clerkID = (await auth()).userId;

    if (!clerkID) {
      return { success: false, error: "Not authenticated" };
    }

    const internalUser = await db.query.usersTable.findFirst({
      where: (u, { eq }) => eq(u.clerkId, clerkID),
    });

    if (!internalUser) {
      return { success: false, error: "User not found" };
    }

    const memberships = await db.query.projectMembers.findMany({
      where: (pm, { eq }) => eq(pm.userId, internalUser.id),
      with: {
        project: true,
      },
    });

    const userProjects = memberships.map((m) => m.project);

    return { success: true, projects: userProjects };
  } catch (error: any) {
    console.error("getUserProjects error:", error);
    return { success: false, error: "Internal server error" };
  }

}

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
  revalidatePath('/projects')

  return { success: true }

}
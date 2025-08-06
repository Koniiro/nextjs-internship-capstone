"use server";
import 'dotenv/config';

import { queries } from '../lib/db/index';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Project, ProjectCreator } from '@/types';


export const getProjects = async () => {
  try {
    const projects = await queries.projects.getAll();
    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getUserProjects=async()=>{
  try {
      const clerkID = (await auth()).userId;

      if (!clerkID) {
        return { success: false, error: "Not authenticated" };
      }

      const internalUser = await queries.users.getById(clerkID)

      if (!internalUser) {
        return { success: false, error: "User not found" };
      }

      const memberships = await queries.projects.getByUser(internalUser.id)

      const userProjects = memberships.map((m) => m.project);

      return {success: true,data: userProjects}
    
  } catch (error) {

    console.error("❌ Error fetching user's projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}

export const createProject=async (

  data:ProjectCreator

)=>{
  try {
    const clerkID=  (await auth()).userId
    if (!clerkID) {
      return { success: false, error: "Not authenticated" };
    }

    // Get internal user UUID from your `usersTable`
    const internalUser = await await queries.users.getById(clerkID)
    if (!internalUser) {
      throw new Error("User not found.");
    }

    
    const [newProject] =await queries.projects.create(internalUser.id,data);

    await queries.projects.projectUserLink(newProject.id,internalUser.id,"Project Owner")
    //revalidatePath('/projects')

    return { success: true, data:newProject }
    
  } catch (error) {
    console.error("❌ Error creating project =>", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }

}
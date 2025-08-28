"use server";
import 'dotenv/config';

import { queries } from '../lib/db/index';

import {  ProjectCreator } from '@/types';
import { clerkAuthCheck } from '@/lib/server_util';


export const getProjects = async () => {
  try {
    clerkAuthCheck()
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

export const getProjectsById = async (projectId:string) => {
  try {
    clerkAuthCheck()
    const project = await queries.projects.getById(projectId)
    return {
      success: true,
      data: project,
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
      const clerkID= await clerkAuthCheck()

      const internalUser = await queries.users.getByClerkId(clerkID)

      if (!internalUser) {
        throw new Error("User not found.");
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
  const clerkID= await clerkAuthCheck()

    // Get internal user UUID from your `usersTable`
  const internalUser = await  queries.users.getByClerkId(clerkID)
  if (!internalUser) {
    throw new Error("User not found.");
  }
  const result =await queries.projects.create(internalUser.id,data);
  if (!result[0]) throw new Error("Project creation failed or duplicate");
  const newProject=result[0]
  const linkCheck=await queries.projects.projectUserLink(newProject.id,internalUser.id,"Project Owner") 
  if (!linkCheck) { 
    await queries.projects.delete(newProject.id); 
    throw new Error(`Project creation failed for user ${internalUser.id}`); 
  }

  return newProject;
}

export const deleteProject=async(projectId:string)=>{
  clerkAuthCheck();

  const deletedId =await queries.projects.delete(projectId)

  if (!deletedId[0]) {
    throw new Error("Project deletion failed or project does not exist");
  }

  return deletedId[0];

}

export const updateProject=async (
  projectId:string,
  data:ProjectCreator
)=>{
  clerkAuthCheck();

  const updatedProject = await queries.projects.update(projectId,data).returning()
  if (!updatedProject[0]) throw new Error("Project update failed or was not found");

  return updatedProject[0];

}


export const closeProject=async(projecId:string)=>{
  try {
      clerkAuthCheck()

      const del = await queries.projects.openProject(projecId).returning()

      return {success: true,data: del}
    
  } catch (error) {

    console.error(`❌ Error closing project ${projecId}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}

export const openProject=async(projecId:string)=>{
  try {
      clerkAuthCheck()

      const del = await queries.projects.openProject(projecId).returning()

      return {success: true,data: del}
    
  } catch (error) {

    console.error(`❌ Error opening project ${projecId}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }

}
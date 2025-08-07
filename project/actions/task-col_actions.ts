

"use server";
import 'dotenv/config';
import { db } from "@/lib/db"
import { taskTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { queries } from '../lib/db/index';
import { clerkAuthCheck } from '@/lib/server_util';
import { ColumnCreate, TaskCreate } from '@/types';

//Column Section
export const getProjectColumns=async(projectId:string)=>{
  try {
      clerkAuthCheck()

      const cols=await queries.cols.getByProject(projectId)

      return {success: true,data: cols}
    
  } catch (error) {

    console.error("❌ Error fetching user's projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}
export const createColumn=async(colData:ColumnCreate)=>{
  try {
      clerkAuthCheck()

      const columns=await queries.cols.create(colData)

      return {success: true,data: columns}
    
  } catch (error) {

    console.error("❌ Error creating new column:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}

export const deleteCol=async(colId:number)=>{
  try {
      clerkAuthCheck()

      const del = await queries.cols.delete(colId)

      return {success: true,data: del}
    
  } catch (error) {

    console.error("❌ Error deleting column", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}
//Task Actions

export const createTask=async(taskData:TaskCreate)=>{
  try {
      clerkAuthCheck()

      const newTask=await queries.tasks.create(taskData)

      return {success: true,data: newTask}
    
  } catch (error) {

    console.error("❌ Error creating new task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}


export const getTasks=async(colId:number)=>{
  try {
      clerkAuthCheck()

      const cols=await queries.tasks.getByCol(colId)

      return {success: true,data: cols}
    
  } catch (error) {

    console.error(`❌ Error fetching tasks for col ${colId}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}




export const deleteTask=async(taskId:number)=>{
  try {
      clerkAuthCheck()

      const del = await queries.tasks.delete(taskId)

      return {success: true,data: del}
    
  } catch (error) {

    console.error(`❌ Error deleting task ${taskId}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}


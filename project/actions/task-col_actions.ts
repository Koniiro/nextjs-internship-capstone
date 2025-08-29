

"use server";
import 'dotenv/config';
import { queries } from '../lib/db/index';
import { clerkAuthCheck } from '@/lib/server_util';
import { ColumnCreate, Task, TaskCreate } from '@/types';

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
  clerkAuthCheck();

  const columns = await queries.cols.create(colData);
  if (!columns[0]) throw new Error("Column insert failed or already exists");

  return columns[0];
}

export const deleteCol=async(colId:number)=>{

  clerkAuthCheck();

  const deleted = await queries.cols.delete(colId);

  if (!deleted[0]) {
    throw new Error("Column deletion failed or column does not exist");
  }

  return deleted[0];
}

export const updateCol=async(coldId:number,coldData:ColumnCreate)=>{

  clerkAuthCheck();

  const columns = await queries.cols.update(coldId,coldData).returning();
  if (!columns[0]) throw new Error("Column update failed or was not found");

  return columns[0];

}

//Task Actions

export const createTask=async(taskData:TaskCreate)=>{
  try {
      clerkAuthCheck()
      console.log("new task",taskData)

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




export const getTasksByProject = async (projectId:string)=>{
  try {
      clerkAuthCheck()

      const taskRows=await queries.tasks.getByProj(projectId)
     

      return {success: true,data: taskRows}
    
  } catch (error) {

    console.error(`❌ Error fetching tasks for project ${projectId}`, error);
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

export const updateTask=async(taskId:number,taskUpdateData:TaskCreate)=>{
  try {
    clerkAuthCheck()

    const updatedTask = await queries.tasks.update(taskId,taskUpdateData).returning()

    if (!updatedTask) {
      throw new Error("Task could not be updated or was not found.");
    }

    return { success: true, data:updatedTask }
    
  } catch (error) {
    console.error("❌ Error updating column =>", error);
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

export const closeTask=async(taskId:number)=>{
  try {
      clerkAuthCheck()

      const del = await queries.tasks.closeTask(taskId).returning()

      return {success: true,data: del}
    
  } catch (error) {

    console.error(`❌ Error closing task ${taskId}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}

export const openTask=async(taskId:number)=>{
  try {
      clerkAuthCheck()

      const del = await queries.tasks.openTask(taskId).returning()

      return {success: true,data: del}
    
  } catch (error) {

    console.error(`❌ Error opening task ${taskId}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}


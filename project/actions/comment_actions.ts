"use server";
import { queries } from '@/lib/db';
import { clerkAuthCheck } from '@/lib/server_util';
import { CommentCreate } from '@/types';
import 'dotenv/config';

export const getCommentsById = async (commentId:string) => {
  try {
    clerkAuthCheck()
    const comment = await queries.comments.getById(commentId)
    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("❌ Error fetching comment:",commentId,"Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getCommentsByTask = async (taskId:number) => {
  try {
    clerkAuthCheck()
    const comments = await queries.comments.getByTask(taskId)
    return {
      success: true,
      data: comments,
    };
  } catch (error) {
    console.error("❌ Error fetching comments of task",taskId,"Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const createComment=async (
  data:CommentCreate
)=>{
  try {
    const clerkID= await clerkAuthCheck()

    // Get internal user UUID from your `usersTable`
    const internalUser =  await queries.users.getByClerkId(clerkID)
    if (!internalUser) {
      throw new Error("User not found.");
    }
    const [newComment] =await queries.comments.create(internalUser.id,data);
  
    return { success: true, data:newComment }
    
  } catch (error) {
    console.error("❌ Error creating Comment =>", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }

}

export const deleteComment=async(commentId:string)=>{
  try {
    clerkAuthCheck()
    const deletedId =await queries.comments.delete(commentId)

    if (!deletedId) {
      throw new Error("Comment could not be deleted or was not found.");
    }

    return {
      success: true,
      data: deletedId,
    };

  } catch (error) {
    console.error(`❌ Error deleting project ${commentId} =>`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }

}
// app/actions.ts
"use server";
import 'dotenv/config';
import { db, queries } from "@/lib/db"
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { clerkAuthCheck } from '@/lib/server_util';
import { UserCreator } from '@/types';
import { Console } from 'console';

export const getUserById = async (userId:string) => {
  await clerkAuthCheck()
  const user = await queries.users.getById(userId)
  if (!user) {
    console.error(`User with ID ${userId} not found`);
    throw new Error(`User with ID ${userId} not found`);
  }
  return user
};

export const getUserIDByClerkId = async () => {
  const clerkId=await clerkAuthCheck()
  const user = await queries.users.getByClerkId(clerkId)
  if (!user) {
    console.error(`User with ID ${clerkId} not found`);
    throw new Error(`User with ID ${clerkId} not found`);
  }
  return user
};


export async function getUserData() {
     return  db.select().from(usersTable);
}
export const createUser=async (
  newUserData:UserCreator

)=>{
  try {

      const columns=await queries.users.createUser(newUserData)

      return {success: true,data: columns}
    
  } catch (error) {

    console.error("❌ Error creating new user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }


}

export const updateUser=async (

  updatedUserData:UserCreator
)=>{
  try {

    // Get internal user UUID from your `usersTable`
    const internalUser = await  queries.users.getByClerkId(updatedUserData.clerkId)
    if (!internalUser) {
      throw new Error("User not found.");
    }

    const updatedCol = await queries.users.updateUser(internalUser.id,updatedUserData).returning()
    
    if (!updatedCol) {
      throw new Error("User could not be updated or was not found.");
    }

    return { success: true, data:updatedCol }
    
  } catch (error) {
    console.error("❌ Error updating column =>", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
  /*const updatedRows = await db.update(usersTable)
    .set({
      name: nUserName,
      email: nEmail,
      updatedAt: nUpdatedAt,
    })
    .where(eq(usersTable.clerkId, nClerkId))
    .returning({ updatedId: usersTable.id });

  if (updatedRows.length > 0) {
    return { success: true, updatedIds: updatedRows.map(row => row.updatedId) };
  } else {
    return { success: false, message: "User not found or update had no effect." };
  }*/

}


export const deleteUser=async (nClerkId:string,)=>{
    const result = await db
  .delete(usersTable)
  .where(eq(usersTable.clerkId, nClerkId));

  const wasDeleted = result.rowCount && result.rowCount > 0;

  if (wasDeleted) {
    return { success: true };
  } else {
    return { success: false, message: "User not found or already deleted." };
  }

}
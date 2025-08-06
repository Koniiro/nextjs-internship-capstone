// app/actions.ts
"use server";
import 'dotenv/config';
import { db } from "@/lib/db"
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


export async function getUserData() {
     return  db.select().from(usersTable);
}
export const createUser=async (
  nClerkId:string,
  nUserName:string,
  nEmail: string,
  nCreatedAt: Date,

)=>{
  await db.insert(usersTable).values({
     clerkId:nClerkId,
     name:nUserName,
     email:nEmail,
     createdAt:nCreatedAt,
     updatedAt:nCreatedAt

  }).onConflictDoNothing()

  return { success: true }

}

export const updateUser=async (
  nClerkId:string,
  nUserName:string,
  nEmail: string,
  nUpdatedAt: Date,

)=>{
  const updatedRows = await db.update(usersTable)
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
  }

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
// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";
import 'dotenv/config';
import { db } from "@/lib/db"
import { usersTable } from "@/lib/db/schema";


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
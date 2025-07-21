// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";
import 'dotenv/config';
import { db } from "@/db"
import { usersTable } from "@/db/schema";

export async function getUserData() {
     return  db.select().from(usersTable);
}
// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";
import 'dotenv/config';
import { db } from "@/db"
import { usersTable } from "@/db/schema";

export async function getData() {
     return  db.select().from(usersTable);
}
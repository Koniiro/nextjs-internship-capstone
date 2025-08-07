import { auth } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function clerkAuthCheck(){
  const clerkID = (await auth()).userId;

  if (!clerkID) {
    throw new Error("User not Authenticated.");
  }
  return clerkID
}

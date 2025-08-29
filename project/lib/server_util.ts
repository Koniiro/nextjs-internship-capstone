"use server"

import { auth } from "@clerk/nextjs/server";
import { queries } from "./db";

export async function clerkAuthCheck(){
  const clerkID = (await auth()).userId;
  if (!clerkID) {
    throw new Error("User not Authenticated.");
  }
  return clerkID
}

export async function roleAuthCheck(teamId:string,clerkId:string){
  const internalUser = await  queries.users.getByClerkId(clerkId)
  if (!internalUser) {
      throw new Error("User not found.");
  }

  const role = await queries.teamMember.getTeamMemberRole(internalUser.id,teamId)
  if (!role) {
    throw new Error(`User ${internalUser.id} is not a member of team ${teamId}`);
  }

   

}
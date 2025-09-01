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

    /*const manager = await queries.teamMember.getTeamManagerRole(internalUser.id,teamId)
    if (!manager) {
      throw new Error(`User ${internalUser.id} is not a member of team ${teamId}`);
    }else if (!manager==false) {
      
    }*/

   

}

export async function teamMGTAuthCheck(teamId:string,clerkId:string){
    const internalUser = await  queries.users.getByClerkId(clerkId)
    if (!internalUser) {
        throw new Error("User not found.");
    }

    const user = await queries.teamMember.getTeamMember(internalUser.id,teamId)

    if (!user) {
      throw new Error(`User is not a member of team ${teamId}`);
    }
    const manager = await queries.teamMember.getTeamManagerRole(internalUser.id,teamId)
    if (manager === false) {
      throw new Error(`User is not authorized as a manager for team ${teamId}`);
    }

   return true;

}
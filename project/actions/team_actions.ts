"use server";
import { queries } from '@/lib/db';
import { clerkAuthCheck, roleAuthCheck } from '@/lib/server_util';
import 'dotenv/config';

export const createTeam = async  (
        teamName:string
    )=>{
    const clerkID= await clerkAuthCheck()

        // Get internal user UUID from your `usersTable`
    const internalUser = await  queries.users.getByClerkId(clerkID)
    if (!internalUser) {
        throw new Error("User not found.");
    }
    const result =await queries.team.createTeam(teamName);

    if (!result[0]) throw new Error("Team creation failed or duplicate");
    const newTeam=result[0]

    // Add Team Leader
    const linkCheck=await queries.teamMember.addTeamMember(internalUser.id,newTeam.id,"Team Leader") 

    if (!linkCheck[0]) { 
        await queries.team.deleteTeam(newTeam.id); 
        throw new Error(`Project creation failed for user ${internalUser.id}`); 
    }

    return newTeam;
} 

export const updateTeam = async  (
        teamId:string,
        newTeamName:string
    )=>{
        const clerkID= await clerkAuthCheck()
        await roleAuthCheck(teamId,clerkID)
        const result = await queries.team.updateTeam(teamId,newTeamName)

        if (!result[0]) throw new Error(`Failed to update team`); 

        return result[0]
    }

export const deleteTeam = async  (
        teamId:string
    )=>{
        const clerkID= await clerkAuthCheck()
        await roleAuthCheck(teamId,clerkID)
        const result = await queries.team.deleteTeam(teamId)

        if (!result[0]) throw new Error(`Failed to delete team`); 

        return result[0]

    }

export const getUserTeams= async()=>{
        const clerkId= await clerkAuthCheck()
        const internalUser = await  queries.users.getByClerkId(clerkId)
        if (!internalUser) {
            throw new Error("User not found.");
        }
        const result = await queries.teamMember.getUserTeams(internalUser.id)
        if (!result || result.length === 0) return [];

        return result
    }

export const getTeamMembers = async(teamId:string)=>{
    const clerkId= await clerkAuthCheck()
    await roleAuthCheck(teamId,clerkId)

    const result = await queries.teamMember.getTeamMember(teamId)

    if (!result[0]) throw new Error(`Failed to get team's users`); 

    return result[0]

    }
export const addTeamMember = async(teamId:string, userId:string, role:string)=>{
    const clerkID= await clerkAuthCheck()
    await roleAuthCheck(teamId,clerkID)

    const result = await queries.teamMember.addTeamMember(userId,teamId,role)

    if (!result[0]) throw new Error(`Failed to add user-${userId} to team`); 

    return result[0]

    }

export const removeTeamMember = async(teamId:string, userId:string, role:string)=>{
    const clerkID= await clerkAuthCheck()
    await roleAuthCheck(teamId,clerkID)

    // TODO: Add Safety Check for team leads
    const memberRole = await queries.teamMember.getTeamMemberRole(userId, teamId);

    const result = await queries.teamMember.removeTeamMember(userId,teamId)
    
    if (!result || result.length === 0) {
    throw new Error("Failed to remove team member. User may not exist in this team.");
    }

    return result[0];
    }
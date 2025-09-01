"use server";
import { userRoles } from '@/lib/constants';
import { queries } from '@/lib/db';
import { clerkAuthCheck, roleAuthCheck, teamMGTAuthCheck } from '@/lib/server_util';
import { MemberInviteSchema, TeamCreate, TeamCreateDataSchema } from '@/types';
import 'dotenv/config';
import { getUserById } from './user_actions';

export const createTeam = async  (
        newTeamData:TeamCreate
    )=>{
    const clerkID= await clerkAuthCheck()

        // Get internal user UUID from your `usersTable`
    const internalUser = await  queries.users.getByClerkId(clerkID)
    if (!internalUser) {
        throw new Error("User not found.");
    }

   const newTeamDataEntry:TeamCreateDataSchema = {
        teamName: newTeamData.team_name,
        teamCreatorId: internalUser.id,
        teamCreatorName: `${internalUser.firstName ?? ""} ${internalUser.lastName ?? ""}`.trim(),
    };

    const result =await queries.team.createTeam(newTeamDataEntry);

    if (!result[0]) throw new Error("Team creation failed or duplicate");
    const newTeam=result[0]

    // Add Team Leader
    const linkCheck=await queries.teamMember.addTeamMember(internalUser.id,newTeam.id,"Team Leader",true) 

    if (!linkCheck[0]) { 
        await queries.team.deleteTeam(newTeam.id); 
        throw new Error(`Project creation failed for user ${internalUser.id}`); 
    }

    return newTeam;
} 

export const updateTeam = async  (
        teamId:string,
        updateTeamData:TeamCreate
    )=>{
        const clerkID= await clerkAuthCheck()
        await teamMGTAuthCheck(teamId,clerkID)
        const result = await queries.team.updateTeam(teamId,updateTeamData.team_name)

        if (!result[0]) throw new Error(`Failed to update team`); 

        return result[0]
    }

export const deleteTeam = async  (
        teamId:string
    )=>{
        const clerkID= await clerkAuthCheck()
        await teamMGTAuthCheck(teamId,clerkID)
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

export const getTeamByID = async(teamId:string)=>{
    
    await clerkAuthCheck()
 
    const result = await queries.team.getById(teamId)
    if (!result[0]) throw new Error(`Failed to get team ${teamId}`); 

    return result[0]
}

export const getUserTeamPermissions = async(teamId:string)=>{
    
    const clerkID= await clerkAuthCheck()
    const internalUser = await  queries.users.getByClerkId(clerkID)
    
    if (!internalUser) {
        throw new Error("User not found.");
    }

    const user = await queries.teamMember.getTeamMember(internalUser.id,teamId)

    if (!user) {
      throw new Error(`User is not a member of team ${teamId}`);
    }
    const manager = await queries.teamMember.getTeamManagerRole(internalUser.id,teamId)

    return manager
}

export const getTeamMembers = async(teamId:string)=>{
    await clerkAuthCheck()

    const result = await queries.teamMember.getTeamMembers(teamId)

    if (!result[0]) throw new Error(`Failed to get team's users`); 

    return result

    }
export const addTeamMember = async(teamId:string, userInvite:MemberInviteSchema)=>{
    const clerkID= await clerkAuthCheck()
    await teamMGTAuthCheck(teamId,clerkID)

    const userQuery= await queries.users.getByEmail(userInvite.userEmail)   //retrieve user Id
    if (!userQuery) throw new Error( `User with email "${userInvite.userEmail}" does not exist or may be misspelled.`); 

    //Make sure role is valid
    if (!userRoles[userInvite.role]) {
        throw new Error(`Invalid role: ${userInvite.role}. Must be one of: ${Object.keys(userRoles).join(", ")}`);
    }

    const result = await queries.teamMember.addTeamMember(userQuery.id,teamId,userInvite.role,userInvite.teamManager)

    if (!result[0]) throw new Error(`Failed to add user-${userQuery.id} to team`); 
    const resultData={
        fName:userQuery.firstName,
        lName:userQuery.lastName,
        joinData:result[0]
    }
    return resultData

    }

export const updateTeamMemberRole = async(userId:string,teamId:string,userRole:string)=>{
    const clerkID= await clerkAuthCheck()
    await teamMGTAuthCheck(teamId,clerkID)
    const user=await getUserById(userId)


    //Make sure role is valid
    if (!userRoles[userRole]) {
        throw new Error(`Invalid role: ${userRole}. Must be one of: ${Object.keys(userRoles).join(", ")}`);
    }
    const result = await queries.teamMember.updateMemberRole(userId, teamId,userRole);
    
    if (!result || result.length === 0) {
        throw new Error("Failed to update team member or user may not exist in this team.");
    }
    const resData={
        result:result[0],
        userName:`${user.firstName} ${user.lastName}`
    }

    return resData;
}

export const updateTeamMemberMGT = async(userId:string,teamId:string,manage:boolean)=>{
    const clerkID= await clerkAuthCheck()
    await teamMGTAuthCheck(teamId,clerkID)
    const user=await getUserById(userId)

    const result = await queries.teamMember.updateMemberPermissions(userId, teamId,manage);
    
    if (!result || result.length === 0) {
        throw new Error("Failed to update team member or user may not exist in this team.");
    }
    const resData={
        result:result[0],
        userName:`${user.firstName} ${user.lastName}`
    }

    return resData;
}

export const removeTeamMember = async(userId:string, teamId:string)=>{
    const clerkID= await clerkAuthCheck()
    await teamMGTAuthCheck(teamId,clerkID)
    const user=await getUserById(userId)

    const result = await queries.teamMember.removeTeamMember(userId,teamId)
    
    if (!result || result.length === 0) {
        throw new Error("Failed to remove team member. User may not exist in this team.");
    }

    const resData={
        result:result[0],
        userName:`${user.firstName} ${user.lastName}`
    }

    return resData;

}
"use client"
import { addTeamMember, createTeam, deleteTeam, getTeamByID, getTeamMembers, getUserTeams, removeTeamMember, updateTeam, updateTeamMemberMGT, updateTeamMemberRole } from '@/actions/team_actions';
import { MemberInviteSchema, TeamCreate } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner";
export function useTeamMembers(teamID:string) {
    const queryClient = useQueryClient()
    // Grab Team Members
    const {
        data: teamMembers,
        isLoading,
        error
    } = useQuery({
        queryKey: ['team',teamID],
        queryFn: async () => {
            return await getTeamMembers(teamID);
        },
    })

    //Grab Team Data
    const {
        data: teamData,
        isLoading: teamLoading,
        error: teamError,
        } = useQuery({
        queryKey: ['teamdata', teamID],
            queryFn: async () => getTeamByID(teamID), // you’d create this query
        });
    
    //Add team Member
    const{
        mutate: useAddTeamMember,
        isPending: isInviting,
        error: connectError,
    }  = useMutation({
    mutationFn: async (userInvite:MemberInviteSchema) => {
        return await addTeamMember(teamID,userInvite);
    },
    onSuccess: (data) => {
        toast.success(
            "Welcome to the team!", {
            description: `You have added ${data.fName} ${data.lName} to the team as a ${data.joinData.role}!`,
        })
        queryClient.invalidateQueries({ queryKey: ['team', teamID] })
    },
    onError: (err) => {
        // React Query passes the thrown error here
        toast.error("Failed to add user to team", { description: err.message });
        console.error("DEV: Failed to add user to team", err);
    },
    })

    //Remove Team Member
    const{
        mutate: useRemoveMember,
        isPending: isRemovingUser,
        error: userRemoveError,
    }  = useMutation({
    mutationFn: async (userId:string) => {
        return await removeTeamMember(userId,teamID);
    },
    onSuccess: (data) => {
        toast.success(
            "User Removed!", {
                description: `You removed ${data.userName} from the team.`
            })
        queryClient.invalidateQueries({ queryKey: ['team', teamID]  })
        },
    onError: (err) => {
            // React Query passes the thrown error here
        toast.error("Failed to remove user", { description: err.message });
        console.error("DEV: User removal failed:", err);
        },
    })
    
    //Update Team Member Role
    const{
        mutate: useUpdateRole,
        isPending: isUpdatingRole,
        error: updateRoleError,
    }  = useMutation({
        mutationFn: async ({ userId, userRole }: { userId: string; userRole: string }) => {
            return await updateTeamMemberRole(userId,teamID,userRole);
        },
        onSuccess: (data) => {
            toast.success(
                "User Role Updated", {
                description: `You made ${data.userName} a ${data.result.role}`,
            })
            queryClient.invalidateQueries({ queryKey: ['team', teamID]  })
        },
        onError: (err) => {
            // React Query passes the thrown error here
            toast.error("Failed to update member role", { description: err.message });
            console.error("DEV: Member role update failed:", err);
        },
    })

    //Update Team Member Permissions
    const{
        mutate: useUpdateTeamMGTRole,
        isPending: isUpdatingTeamMGT,
        error: updateTeamMGTError,
    }  = useMutation({
        mutationFn: async ({ userId, manage }: { userId: string; manage: boolean }) => {
            return await updateTeamMemberMGT(userId,teamID,manage);
        },
        onSuccess: (data) => {
            toast.success(
                "User Permissions Updated", {
                description: `You made ${data.userName} a Team Manager`,
            })
            queryClient.invalidateQueries({ queryKey: ['team', teamID]  })
        },
        onError: (err) => {
            // React Query passes the thrown error here
            toast.error("Failed to update member permissions", { description: err.message });
            console.error("DEV: Member permissions update failed:", err);
        },
    })

    return {
        teamMembers,
        isLoading,
        error,
        teamData,
        teamLoading,
        teamError,

        addTeamMember:  (userInvite:MemberInviteSchema) => useAddTeamMember(userInvite),
        isInviting: isInviting,
        connectError: connectError,

        removeTeamMember:(userId:string) =>useRemoveMember(userId),
        updateMemberRole:(userId:string, userRole:string) => useUpdateRole({userId,userRole}),
        updateTeamMemberMGT:(userId:string, manage:boolean) => useUpdateTeamMGTRole({userId,manage})
        //updateTeam:(teamId:string, newTeamData:TeamCreate)=>useUpdateTeam({teamId,newTeamData}),
        //isUpdating:isUpdating,
        //updateError:updateError,

       // deleteTeam: (teamId: string) => useDeleteTeam(teamId),
    }
}
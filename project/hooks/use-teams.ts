"use client"
import { createTeam, deleteTeam, getTeamByID, getUserTeams, updateTeam } from '@/actions/team_actions';
import { TeamCreate } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner";
export function useTeams() {
    const queryClient = useQueryClient()
    // Grab User Projects
    const {
        data: teams,
        isLoading,
        error
    } = useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            return await getUserTeams();
        },
    })

    const{
        mutate: useCreateTeam,
        isPending: isCreating,
        error: createError,
    }  = useMutation({
    mutationFn: async (newTeam:TeamCreate) => {
        return await createTeam(newTeam);
    },
    onSuccess: (data) => {
        toast.success(
            "Team Created!", {
            description: `Your new project "${data.teamName}" has been successfully created (ID: ${data.id}).`,
        })
        queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
    onError: (err) => {
        // React Query passes the thrown error here
        toast.error("Failed to create team", { description: err.message });
        console.error("Team creation failed:", err);
    },
    })

    const{
        mutate: useDeleteTeam,
        isPending: isDeleting,
        error: deleteError,
    }  = useMutation({
    mutationFn: async (teamId:string) => {
        return await deleteTeam(teamId);
    },
    onSuccess: (data) => {
        toast.success(
            "Team Deleted!", {
            description: `Team ${data.deletedName} has been successfully deleted.`,
            })
        queryClient.invalidateQueries({ queryKey: ['teams'] })
        },
    onError: (err) => {
            // React Query passes the thrown error here
        toast.error("Failed to delete team", { description: err.message });
        console.error("Team deletion failed:", err);
        },
    })
    

    const{
        mutate: useUpdateTeam,
        isPending: isUpdating,
        error: updateError,
    }  = useMutation({
        mutationFn: async ({ teamId, newTeamData }: { teamId: string; newTeamData: TeamCreate }) => {
            return await updateTeam(teamId,newTeamData);
        },
        onSuccess: (data) => {
            toast.success(
                "Team Updated!", {
                description: `Team "${data.teamName}" has been successfully updated.`,
            })
            queryClient.invalidateQueries({ queryKey: ['teams'] })
        },
        onError: (err) => {
            // React Query passes the thrown error here
            toast.error("Failed to update team", { description: err.message });
            console.error("Team update failed:", err);
        },
    })

    return {
        userTeams: teams,
        isLoading: isLoading,
        error: error,

        createTeam:(teamData:TeamCreate)=>useCreateTeam(teamData),
        isCreating:isCreating,
        createError: createError,

        updateTeam:(teamId:string, newTeamData:TeamCreate)=>useUpdateTeam({teamId,newTeamData}),
        isUpdating:isUpdating,
        updateError:updateError,

        deleteTeam: (teamId: string) => useDeleteTeam(teamId),
    }
}

export function useTeamData(teamId:string){
     const queryClient = useQueryClient()
    // Grab User Projects
    const {
        data: teamData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['teamData',teamId],
        queryFn: async () => {
            return await getTeamByID(teamId);
        },
    })


    const{
        mutate: useUpdateTeam,
        isPending: isUpdating,
        error: updateError,
    }  = useMutation({
        mutationFn: async ({ teamId, newTeamData }: { teamId: string; newTeamData: TeamCreate }) => {
            return await updateTeam(teamId,newTeamData);
        },
        onSuccess: (data) => {
            toast.success(
                "Team Updated!", {
                description: `Team ${data.teamName} has been successfully updated.`,
            })
            queryClient.invalidateQueries({ queryKey: ['teamData',teamId] })
        },
        onError: (err) => {
            // React Query passes the thrown error here
            toast.error("Failed to update team", { description: err.message });
            console.error("Team update failed:", err);
        },
    })

    const{
        mutate: useDeleteTeam,
        isPending: isDeleting,
        error: deleteError,
    }  = useMutation({
    mutationFn: async (teamId:string) => {
        return await deleteTeam(teamId);
    },
    onSuccess: (data) => {
        toast.success(
            "Team Deleted!", {
            description: `Team ${data.deletedName} has been successfully deleted.`,
            })
        queryClient.invalidateQueries({ queryKey: ['teamData',teamId] })
        },
    onError: (err) => {
            // React Query passes the thrown error here
        toast.error("Failed to delete team", { description: err.message });
        console.error("Team deletion failed:", err);
        },
    })

    return{

        teamData: teamData,
        teamLoading: isLoading,
        teamError: error,

        updateTeam:(teamId:string, newTeamData:TeamCreate)=>useUpdateTeam({teamId,newTeamData}),
        isUpdating:isUpdating,
        updateError:updateError,

        deleteTeam: (teamId: string) => useDeleteTeam(teamId),



    }

}
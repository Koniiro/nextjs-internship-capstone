"use client"
import { createTeam, deleteTeam, getUserTeams, updateTeam } from '@/actions/team_actions';
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
    mutationFn: async (teamName:string) => {
        return await createTeam(teamName);
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
        mutationFn: async ({ teamId, newTeamName }: { teamId: string; newTeamName: string }) => {
            return await updateTeam(teamId,newTeamName);
        },
        onSuccess: (data) => {
            toast.success(
                "Team Updated!", {
                description: `Project "${data.teamName}" has been successfully updated.`,
            })
            queryClient.invalidateQueries({ queryKey: ['projects'] })
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

        createTeam:(teamName:string)=>useCreateTeam(teamName),
        isCreating:isCreating,
        createError: createError,

        updateTeam:(teamId:string, teamName:string)=>useUpdateTeam({teamId,newTeamName:teamName}),
        isUpdating:isUpdating,
        updateError:updateError,

        deleteTeam: (teamId: string) => useDeleteTeam(teamId),
    }
}
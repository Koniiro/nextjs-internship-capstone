"use client"

import { getUserById, getUserIDByClerkId } from "@/actions/user_actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export function useDBUser(userId:string){
    const queryClient = useQueryClient()
    const {
        data: user,
        isLoading,
        error
    } = useQuery({
        queryKey: ['user',userId],
        queryFn: async () => {
            if (userId==='') return null;
            return await getUserById(userId);

        },
        enabled: !!userId,

    })

    return {
        user: user,
        userLoading: isLoading,
        userError: error,
    }

}

export function useClerkUser(){
    const queryClient = useQueryClient()
    const {
        data: user,
        isLoading,
        error
    } = useQuery({
        queryKey: ['clerkUser'],
        queryFn: async () => {
            return await getUserIDByClerkId();

        },

    })

    return {
        clerkUser: user,
        clerkUserLoading: isLoading,
        clerkUserError: error,
    }

}
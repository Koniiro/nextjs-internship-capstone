"use client"

import { getUserById } from "@/actions/user_actions";
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
            return await getUserById(userId);

        },

    })

    return {
        user: user,
        userLoading: isLoading,
        userError: error,
    }

}
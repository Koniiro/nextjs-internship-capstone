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
        const res = await getUserById(userId);
        if (!res.success) throw new Error(res.error);
        return res.data;
        },
    })

    return {
        user: user,
        isLoading: isLoading,
        error: error,
    }

}
"use client"

import { createComment, deleteComment, getCommentsByTask } from "@/actions/comment_actions";
import {  CommentCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export function useTaskComments(taskId:number) {
    const queryClient = useQueryClient()
    const {
        data: comments,
        isLoading,
        error
    } = useQuery({
        queryKey: ['comments',taskId],
        queryFn: async () => {
        const res = await getCommentsByTask(taskId);
        if (!res.success) throw new Error(res.error);
            return res.data;
        },
    })

    const{
        mutate: useCreateComment,
        isPending: isCreating,
        error: createError,
    }  = useMutation({
        mutationFn: async (data:CommentCreate) => {
            console.log('Creating Task',data)
            const res = await createComment(data);
            if (!res.success) throw new Error(res.error);
                return res.data;
        },
        onSuccess: () => {
            console.log("Comment Creation Success",)
            queryClient.invalidateQueries({ queryKey: ['comments',taskId]})
        }
    })

    const{
        mutate: useDeleteComment,
        isPending: isDeleting,
        error: deleteError,
    }  = useMutation({
        mutationFn: async (commendId:string) => {
          console.log('Deleting Task',commendId)
          const res = await deleteComment(commendId);
          if (!res.success) throw new Error(res.error);
            return res.data;
        },
        onSuccess: () => {
          console.log("Comment deletion Success",)
          queryClient.invalidateQueries({ queryKey: ['comments',taskId] })
        }
    })

    return {
       comments,
       isLoading,
       error,
       
       isCreating:isCreating,
       createError:createError,
       
       //isUpdating: isUpdating,
       //updateError: updateError,
   
       isDeleting: isDeleting,
       deleteError: deleteError,

       createComment: (data: CommentCreate) => useCreateComment(data),
       //updateTask: (taskId: number, taskUpdateData: TaskCreate) => useUpdateTask({taskId,taskUpdateData}),
       deleteComment: (id: string) => useDeleteComment(id),
       
    }

}
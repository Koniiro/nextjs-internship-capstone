"use client"
import { closeTask, createTask, deleteTask, getTasks, getTasksByProject, openTask, updateTask } from "@/actions/task-col_actions";
import { TaskCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useTasks(colId: number) {
  const queryClient = useQueryClient()
  const {
      data: tasks,
      isLoading,
      error
  } = useQuery({
      queryKey: ['tasks',colId],
      queryFn: async () => {
      const res = await getTasks(colId);
      if (!res.success) throw new Error(res.error);
      return res.data;
      },
  })

  //Create Column
  const{
      mutate: useCreateTask,
      isPending: isCreating,
      error: createError,
    }  = useMutation({
      mutationFn: async (data:TaskCreate) => {
        console.log('Creating Task',data)
        const res = await createTask(data);
        if (!res.success) throw new Error(res.error);
        return res.data;
      },
      onSuccess: () => {
        console.log("Task Creation Success",)
        queryClient.invalidateQueries({ queryKey: ['tasks',colId] })
      }
     
  })

  const{
    mutate: useDeleteTask,
    isPending: isDeleting,
    error: deleteError,
  }  = useMutation({
    mutationFn: async (taskId:number) => {
      console.log('Deleting Task',taskId)
      const res = await deleteTask(taskId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      console.log("Task deletion Success",)
      queryClient.invalidateQueries({ queryKey: ['tasks',colId] })
    }
  })

  //update Task
  const{
      mutate: useUpdateTask,
      isPending: isUpdating,
      error: updateError,
    }  = useMutation({
      mutationFn: async ({ taskId, taskUpdateData }: { taskId: number; taskUpdateData: TaskCreate }) => {
        console.log('Updating Task',taskId,colId)
        const res = await updateTask(taskId,taskUpdateData);
        if (!res.success) throw new Error(res.error);
        return res.data;
      },
      onSuccess: () => {
        console.log(" Column update Success",)
        queryClient.invalidateQueries({ queryKey: ['tasks',colId] })
      }
    })
  
  return {
    tasks,
    isLoading,
    error,
    
    isCreating:isCreating,
    
    isUpdating: isUpdating,
    updateError: updateError,

    isDeleting: isDeleting,
    deleteError: deleteError,
    createTask: (data: TaskCreate) => useCreateTask(data),
    updateTask: (taskId: number, taskUpdateData: TaskCreate) => useUpdateTask({taskId,taskUpdateData}),
    deleteTask: (id: number) => useDeleteTask(id),
    moveTask: (taskId: string, newListId: string, position: number) =>
      console.log(`TODO: Move task ${taskId} to list ${newListId} at position ${position}`),
  }
}


export function useProjectTasks(projectId: string) {
  const queryClient = useQueryClient()
  const {
      data: projectTasks,
      isLoading,
      error
  } = useQuery({
      queryKey: ['tasks',projectId],
      queryFn: async () => {
      const res = await getTasksByProject(projectId);
      if (!res.success) throw new Error(res.error);
      return res.data;
      },
  })

  const{
    mutate: useUpdateProjectTasks,
    isPending: isUpdating,
    error: updateError,
  }  = useMutation({
    mutationFn: async ({ taskId, taskUpdateData }: { taskId: number; taskUpdateData: TaskCreate }) => {
        console.log('Updating Task - ',taskId,taskUpdateData)
        const res = await updateTask(taskId,taskUpdateData);
        if (!res.success) throw new Error(res.error);
        return res.data;
      },
      onSuccess: () => {
        console.log(" Task update Success")
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
      }
  })

  const{
    mutate: useCloseTask,
    isPending: isClosing,
    error: closeError,
  }  = useMutation({
    mutationFn: async ({ taskId,  }: { taskId: number; }) => {
        const res = await closeTask(taskId);
        if (!res.success) throw new Error(res.error);
        return res.data;
      },
      onSuccess: () => {
        console.log(" Task was closed")
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
      }
  })
  const{
    mutate: useOpenTask,
    isPending: isOpening,
    error: openError,
  }  = useMutation({
    mutationFn: async ({ taskId,  }: { taskId: number; }) => {
        const res = await openTask(taskId);
        if (!res.success) throw new Error(res.error);
        return res.data;
      },
      onSuccess: () => {
        console.log(" Task was opened")
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
      }
  })
  
  return {
    projectTasks,
    isLoading,
    error,

    isPending: isUpdating,
    updateError: updateError,

    updateTask: (taskId: number, taskUpdateData: TaskCreate) => useUpdateProjectTasks({taskId,taskUpdateData}),
    
    isClosing:isClosing,
    isOpening:isOpening,

    closeError:closeError,
    openError:openError,
    
    closeTask:(taskId:number) =>useCloseTask({taskId}),
    openTask:(taskId:number) =>useOpenTask({taskId}),
  }
}
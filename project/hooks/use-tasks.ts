// TODO: Task 4.4 - Build task creation and editing functionality
// TODO: Task 5.4 - Implement optimistic UI updates for smooth interactions
"use client"
import { createTask, getTasks } from "@/actions/task-col_actions";
import { TaskCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/*
TODO: Implementation Notes for Interns:

Custom hook for task data management:
- Fetch tasks for a project
- Create new task
- Update task
- Delete task
- Move task between lists
- Bulk operations

Features:
- Optimistic updates for smooth UX
- Real-time synchronization
- Conflict resolution
- Undo functionality
- Batch operations

Example structure:
export function useTasks(projectId: string) {
  const queryClient = useQueryClient()
  
  const {
    data: tasks,
    isLoading,
    error
  } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => queries.tasks.getByProject(projectId),
    enabled: !!projectId
  })
  
  const createTask = useMutation({
    mutationFn: queries.tasks.create,
    onMutate: async (newTask) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] })
      const previousTasks = queryClient.getQueryData(['tasks', projectId])
      queryClient.setQueryData(['tasks', projectId], (old: Task[]) => [...old, { ...newTask, id: 'temp-' + Date.now() }])
      return { previousTasks }
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks', projectId], context?.previousTasks)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    }
  })
  
  return {
    tasks,
    isLoading,
    error,
    createTask: createTask.mutate,
    isCreating: createTask.isPending
  }
}
*/

// Placeholder to prevent import errors
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
      //const res = await deleteCol(colId);
      //if (!res.success) throw new Error(res.error);
      //return res.data;
    },
    onSuccess: () => {
      console.log("Task deletion Success",)
      queryClient.invalidateQueries({ queryKey: ['tasks',colId] })
    }
  })
  
  return {
    tasks,
    isLoading,
    error,

    isCreating:isCreating,
    createTask: (data: TaskCreate) => useCreateTask(data),
    updateTask: (id: string, data: any) => console.log(`TODO: Update task ${id}`, data),
    deleteTask: (id: number) => useDeleteTask(id),
    moveTask: (taskId: string, newListId: string, position: number) =>
      console.log(`TODO: Move task ${taskId} to list ${newListId} at position ${position}`),
  }
}

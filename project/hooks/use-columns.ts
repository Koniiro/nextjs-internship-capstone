"use client"
import { createColumn, deleteCol, getProjectColumns, updateCol } from "@/actions/task-col_actions"
import { ColumnCreate, ProjectCreator,Column } from "@/types"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner"

  

export function useColumns(projectId:string){
    const queryClient = useQueryClient()
    const {
        data: columns,
        isLoading,
        error
    } = useQuery({
        queryKey: ['columns',projectId],
        queryFn: async () => {
        const res = await getProjectColumns(projectId);
        if (!res.success) throw new Error(res.error);
        return res.data;
        },
    })
      //Create Column
    const{
        mutate: useCreateColumn,
        isPending: isCreating,
        error: createError,
      }  = useMutation({
        mutationFn: async (data:ColumnCreate) => {
          return await createColumn(data);
        },
        onSuccess: (data) => {
          toast.success(
            "Column Added!", {
            description: `Your new column "${data.name}" has been successfully created (ID: ${data.id}).`,
          })
          queryClient.invalidateQueries({ queryKey: ['columns',projectId] })
        },
        onError: (err) => {
          // React Query passes the thrown error here
          toast.error("Failed to create column", { description: err.message });
          console.error("Column creation failed:", err);
        },
      })
      
      //Delete Column
      const{
          mutate: useDeleteCol,
          isPending: isDeleting,
          error: deleteError,
        }  = useMutation({
          mutationFn: async (colId:number) => {
            return await deleteCol(colId);
          },
          onSuccess: (data) => {
            toast.success(
              "Column Deleted!", 
            {
              description: `Column ${data.deletedId} has been successfully deleted.`,
            })
            queryClient.invalidateQueries({ queryKey: ['columns',projectId] })
          },
          onError: (err) => {
            // React Query passes the thrown error here
            toast.error("Failed to delete column", { description: err.message });
            console.error("Column deletion failed:", err);
          },
        })
      //update Column
      const{
          mutate: useUpdateCol,
          isPending: isUpdating,
          error: updateError,
        }  = useMutation({
          mutationFn: async ({ colId, colUpdateData }: { colId: number; colUpdateData: ColumnCreate }) => {
            return await updateCol(colId,colUpdateData);
          },
          onSuccess: (data) => {
            toast.success(
              "Column Updated!", 
            {
              description: `Column "${data.name}" has been successfully updated.`,
            })
            queryClient.invalidateQueries({ queryKey: ['columns',projectId] })
          },
          onError: (err) => {
            // React Query passes the thrown error here
            toast.error("Failed to update column", { description: err.message });
            console.error("Column update failed:", err);
          },
        })


    return {
        columns: columns,
        isLoading: isLoading,
        error: error,

        isDeleting:isDeleting,
        deleteError:deleteError,

        isCreating:isCreating,
        createError:createError,

        isUpdating:isUpdating,
        updateError:updateError,

        
        createCol: (data: ColumnCreate) =>useCreateColumn(data),
        updateCol: (colId:number,colUpdateData: ColumnCreate) => useUpdateCol({colId,colUpdateData}),
        deleteCol: (id: number) => useDeleteCol(id),
    }
}
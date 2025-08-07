import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { TaskCard } from "@/components/task-card";
import { useTasks } from "@/hooks/use-tasks";
import { Column } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useColumns } from "@/hooks/use-columns";

export interface KanbanColumnProps {
  column: Column
}

export default function KanbanColumn({column}:KanbanColumnProps){
    const{tasks,isLoading,error}=useTasks(column.id)
    const{deleteCol}=useColumns(column.projectId)
     if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Failed to load tasks {error.message}</p>;
    if (!tasks) return <p>Failed to load tasks</p>;

    const delColHandler = async () => { 
      deleteCol(column.id)
   }
    
    return(
        <div className="flex-shrink-0 w-80">
                <div className="bg-gray-300 dark:bg-outer_space-400 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400">
                  <div className="p-4 border-b border-french_gray-300 dark:border-payne's_gray-400">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">
                        {column.name}
                        <span className="ml-2 px-2 py-1 text-xs bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full">
                          {tasks.length}
                        </span>
                      </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-muted">
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-zinc-900 text-sm">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={delColHandler}
                        className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                    </div>
                  </div>

                  <div className="p-4 space-y-3 min-h-[400px]">
                    <ScrollArea className="h-85 ">
                      <div className="flex flex-col gap-2">
                        {tasks.map((task,key) => (
                        <TaskCard key={key} task={task}/>
                      ))}
                      </div>
                      
       
                    </ScrollArea>
                    
                    <CreateTaskModal colId={column.id}/>
                  </div>
                </div>
              </div>
    )
}
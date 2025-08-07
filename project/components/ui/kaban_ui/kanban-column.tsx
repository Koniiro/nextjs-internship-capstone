import { TaskCard } from "@/components/task-card";
import { useTasks } from "@/hooks/use-tasks";
import { Column } from "@/types";
import { MoreHorizontal } from "lucide-react";


export interface KanbanColumnProps {
  column: Column
}

export default function KanbanColumn({column}:KanbanColumnProps){
    const{tasks,isLoading,error}=useTasks(column.id)
     if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Failed to load tasks {error.message}</p>;
    if (!tasks) return <p>Failed to load tasks</p>;


    
    return(
        <div className="flex-shrink-0 w-80">
                <div className="bg-gray-300 dark:bg-outer_space-400 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400">
                  <div className="p-4 border-b border-french_gray-300 dark:border-payne's_gray-400">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">
                        {column.name}
                        <span className="ml-2 px-2 py-1 text-xs bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full">
                          0
                        </span>
                      </h3>
                      <button className="p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 min-h-[400px]">
                    {tasks.map((task,key) => (
                      <TaskCard key={key} task={task}/>
                      
                    ))}

                    <button className="w-full p-3 border-2 border-dashed border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
                      + Add task
                    </button>
                  </div>
                </div>
              </div>
    )
}
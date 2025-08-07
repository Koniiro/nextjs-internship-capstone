import { useTasks } from "@/hooks/use-tasks";
import { Column } from "@/types";
import { MoreHorizontal } from "lucide-react";


export interface KanbanColumnProps {
  column: Column
}

export default function KanbanColumn({column}:KanbanColumnProps){
    const{tasks,isLoading,error}=useTasks(column.id)
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
                    {[1, 2, 3].map((taskIndex) => (
                      <div
                        key={taskIndex}
                        className="p-4 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-medium text-outer_space-500 dark:text-platinum-500 text-sm mb-2">
                          Sample Task {taskIndex}
                        </h4>
                        <p className="text-xs text-payne's_gray-500 dark:text-french_gray-400 mb-3">
                          This is a placeholder task description
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue_munsell-100 text-blue_munsell-700 dark:bg-blue_munsell-900 dark:text-blue_munsell-300">
                            Medium
                          </span>
                          <div className="w-6 h-6 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            U
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className="w-full p-3 border-2 border-dashed border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
                      + Add task
                    </button>
                  </div>
                </div>
              </div>
    )
}
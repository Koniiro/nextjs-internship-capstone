"use client"

// TODO: Task 5.6 - Create task detail modals and editing interfaces

import { Task } from "@/types"
import { ArrowDownToLine, ArrowUpToLine, MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { UpdateTaskModal } from "../modals/update-task-modal"
import { useState } from "react"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { useTasks } from "@/hooks/use-tasks"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";

import { TaskPriorityBadge, TaskStatusBadge } from "../ui/status_badges"
import  TaskContent  from "./task-content-handler"


/*
TODO: Implementation Notes for Interns:

This component should display:
- Task title and description
- Priority indicator
- Assignee avatar
- Due date
- Labels/tags
- Comments count
- Drag handle for reordering

Props interface:
interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    assignee?: User
    dueDate?: Date
    labels: string[]
    commentsCount: number
  }
  isDragging?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

Features to implement:
- Drag and drop support
- Click to open task modal
- Priority color coding
- Overdue indicators
- Responsive design
*/
interface TaskCardProps {
  id:number
  task:Task
  isDragging?: boolean
  arrayPosition?:number
  taskArrayLength?:number
  topHandler?: () => void;
  bottomHandler?: () => void;
}


export function TaskCard( {id,task,arrayPosition, isDragging,taskArrayLength,topHandler,bottomHandler }: TaskCardProps) {
  const{deleteTask,isDeleting,deleteError}=useTasks(task.columnId)
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }
  const disableCheckTop =
    arrayPosition == null ? true : arrayPosition === 0;

  const disableCheckBottom =
    taskArrayLength == null ? true : arrayPosition === taskArrayLength - 1;
  const {attributes, listeners, setNodeRef, transform, transition} =useSortable(
    {id:id,
    data: {
    type: "task",
    task,
   }

  })
  
  const style = {
        transition,
        transform: CSS.Transform.toString(transform),
  };


  const delTaskHandler = async () => { 
    deleteTask(task.id)
  }
  return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="p-4 my-2 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 cursor-grab hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <TaskContent task={task}/>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger disabled={isDragging}><MoreHorizontal size={16} /></DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuLabel>Task</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem  className="cursor-pointer hover:bg-muted">
                      <DialogTrigger className=" flex flex-row items-center gap-2">
                        <Pencil size={16}/> Edit Task
                      </DialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={delTaskHandler}
                      className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <Trash size={16} />
                        Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Position</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className=" flex flex-row items-center cursor-pointer" disabled={disableCheckTop} onClick={topHandler}>
                        <ArrowUpToLine size={12}/> Move to Top
                        
                      </DropdownMenuItem>
                      <DropdownMenuItem  className=" flex flex-row items-center cursor-pointer" disabled={disableCheckBottom} onClick={bottomHandler} >
                        <ArrowDownToLine size={12}/> Move to Bottom
                        
                      </DropdownMenuItem>

                    </DropdownMenuGroup>
                
              </DropdownMenuContent>
            </DropdownMenu>
            <UpdateTaskModal task={task}/>
          </Dialog>
        </div>
      

        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2">
            <TaskStatusBadge status={task.openStatus}/>
            <TaskPriorityBadge priority={task.priority}/>
          </div>
          <div className="w-6 h-6 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            U
          </div>
        </div>
        
      </div>
  )
}

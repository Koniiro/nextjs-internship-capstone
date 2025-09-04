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

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";

import { TaskPriorityBadge, TaskStatusBadge } from "../ui/status_badges"
import { useTaskSheet } from "./task-sheet-context"
import { useUpdateTaskModal } from "./task-update-modal-context"
import { hasProjectPermission, Role } from "@/lib/role_perms"
import { useDBUser } from "@/hooks/use-users"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"


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
  projectId:string
  role:Role
  topHandler?: () => void;
  bottomHandler?: () => void;
  delTaskHandler?: () => void;
}


export function TaskCard( {id,task,arrayPosition, projectId,isDragging,taskArrayLength, delTaskHandler , topHandler,bottomHandler,role }: TaskCardProps) {
  const { setTaskToEdit } = useUpdateTaskModal();
  const { setActiveTask } = useTaskSheet();
  const {attributes, listeners, setNodeRef, transform, transition} =useSortable(
    {id:id,
    data: {
    type: "task",
    task,
   }

  })
  const {user, userLoading,userError} =useDBUser(task.assigneeId||'')
  if (userLoading) return <p>Loading...</p>;
  //if (userError) return <p>Failed to load user {userError.message}</p>;
  //if (!user) return <p>Failed to load user</p>;


  const disableCheckTop =
    arrayPosition == null ? true : arrayPosition === 0;

  const disableCheckBottom =
    taskArrayLength == null ? true : arrayPosition === taskArrayLength - 1;
  
  
  const style = {
        transition,
        transform: CSS.Transform.toString(transform),
  };


  const editTaskHandler = async () => { 
    setTaskToEdit(task)
  }
  return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="p-4 my-2 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 cursor-grab hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div onClick={() => setActiveTask(task)}>
            {/* Task content */}
            <h4 className="font-medium hover:underline hover:font-bold hover:text-outer_space-700 hover text-outer_space-500 dark:text-platinum-500 text-sm mb-2 cursor-pointer" >
                {task.title}
            </h4>
          </div>
          
          
            <DropdownMenu>
              <DropdownMenuTrigger disabled={isDragging}><MoreHorizontal size={16} /></DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuLabel>Task</DropdownMenuLabel>
                  {hasProjectPermission(role,"updateTask") &&
                  <div>
                  <DropdownMenuGroup>
                    
                    <DropdownMenuItem 
                     onClick={editTaskHandler}
                     className="cursor-pointer hover:bg-muted flex flex-row items-center gap-2">
                      <Pencil size={16}/> Edit Task
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
                  </div>
                  }
                  
                
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
            
        </div>
      

        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2">
            <TaskStatusBadge status={task.openStatus}/>
            <TaskPriorityBadge priority={task.priority}/>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              @{user?.userName}
            </span>
          </div>
          <Avatar className="h-5 w-5 rounded-full border-outer_space-200 border">
              <AvatarImage src={user?.avatarURL ?? undefined}  className="h-5 w-5  rounded-full object-cover object-center"/>
              <AvatarFallback className="rounded-full">{user?.firstName && user?.lastName
                ? `${user?.firstName[0]}${user?.lastName[0]}`
                : "人"}</AvatarFallback>
          </Avatar>
        </div>
        
      </div>
  )
}

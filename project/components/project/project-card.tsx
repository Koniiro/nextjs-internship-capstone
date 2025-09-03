'use client'
import { Project, ProjectCardHandler, ProjectCreator } from '../../types/index';
import Link from 'next/link';
import { Calendar, MoreHorizontal, UsersRound, UserRoundCog, UserRoundPen, UserRoundX, Pencil, Trash } from "lucide-react"
import { Button } from '../ui/button';
import { userRoles } from '@/lib/constants';
import { UpdateProjectModal } from '../modals/update-project-modal';
import ProjectStatusChip from './project-status-chip';
import { useCompletionRatio } from '@/hooks/use-utils';
import { Progress } from '../ui/progress';
import { useTeamData } from '@/hooks/use-teams';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useState } from 'react';

import { AlertDialog,AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from '../ui/alert-dialog';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { hasProjectPermission, Role } from '@/lib/role_perms';

// TODO: Task 4.5 - Design and implement project cards and layouts

/*
TODO: Implementation Notes for Interns:

This component should display:
- Project name and description
- Progress indicator
- Team member count
- Due date
- Status badge
- Actions menu (edit, delete, etc.)

Props interface:
interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    progress: number
    memberCount: number
    dueDate?: Date
    status: 'active' | 'completed' | 'on-hold'
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

Features to implement:
- Hover effects
- Click to navigate to project board
- Responsive design
- Loading states
- Error states
*/

export interface ProjectCardProps {
  projectData: ProjectCardHandler

  onEdit: (id: string,data:ProjectCreator) => void
  onDelete: (id: string) => void
}

export default function ProjectCard({projectData,onDelete,onEdit}:ProjectCardProps,) {
  const ratio = useCompletionRatio(projectData.project.id);
  const[openDiag,setOpenDiag] = useState(false)
  const{teamData,teamLoading,teamError}=useTeamData(projectData.project.teamOwner)

  if (teamLoading) return <p>Loading...</p>;
  if (teamError) return <p>Failed to load team {teamError.message}</p>;
  if (!teamData) return <p>Failed to load team data</p>;

  function isRole(value: string): value is Role {
    return [
      "Developer",
      "QA",
      "Scrum Master",
      "Product Owner",
      "Designer",
      "DevOps",
      "Business Analyst",
      "Team Leader",
    ].includes(value);
  }

  let role: Role;

  if (isRole(projectData.role)) {
    role = projectData.role; // ✅ safe
  } else {
    throw new Error(`Invalid role: ${projectData.role}`);
}
  const delProjectHandler = async () => { 
        onDelete(projectData.project.id)
  }

  return (
    <div key={projectData.project.id}
          className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-3 h-3 rounded-full bg-${projectData.project.color}`} />
        {hasProjectPermission(role,"edit/delete") &&
          <Dialog open={openDiag} onOpenChange={setOpenDiag}>
            <DropdownMenu>
            <DropdownMenuTrigger ><MoreHorizontal size={16} /></DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem  className="cursor-pointer hover:bg-muted">
                    <DialogTrigger className=" flex flex-row items-center gap-2">
                        <Pencil size={16}/> Edit Project
                    </DialogTrigger>
                    </DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                <Trash size={16} />
                                Delete Project
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className=" text-red-600 flex flex-row items-center gap-2"> <Trash size={16} />Delete this Team</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. All  Tasks related to this team will be lost.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className=" text-red-600 hover:bg-red-50 dark:hover:bg-red-900"onClick={delProjectHandler}>
                                Yes, Delete.
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                </DropdownMenuGroup>              
            </DropdownMenuContent>
            </DropdownMenu>
            <UpdateProjectModal projectData={projectData.project} setOpen={setOpenDiag}/>

          </Dialog>
        
        }
        
      </div>
      <Link href={`/projects/${projectData.project.id}`}>      
        <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">{projectData.project.name}</h3>
      </Link>

      <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4 line-clamp-2">
        {projectData.project.description ?? "No description provided."}
      </p>

      <div className="flex items-center justify-between text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4">
        <Link
          href={`/team/${teamData.id}`}
          className="px-2 py-1 flex flex-row gap-2 items-center text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          <UsersRound size={16} className="mr-1" />
          {teamData.teamName}
        </Link>
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          {projectData.project.due_date?.toDateString()}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-payne's_gray-500 dark:text-french_gray-400">Progress</span>
          {ratio === 0 ? (
              <span className="text-outer_space-500 dark:text-platinum-500 font-medium">
                No tasks
              </span>
            ) : (
              <span className="text-outer_space-500 dark:text-platinum-500 font-medium">
                {ratio*100}%
              </span>
            )}
          
        </div>
        <Progress value={ratio*100} color={projectData.project.color} className='h-2' />
      </div>

      <div className="flex flex-row items-center justify-between">
        <ProjectStatusChip statusId={projectData.project.statusId} />
        
      </div>
    </div>
  )
}

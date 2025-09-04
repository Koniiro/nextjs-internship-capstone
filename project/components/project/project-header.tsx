
import { useTeamData } from "@/hooks/use-teams";
import { hasProjectPermission, Role } from "@/lib/role_perms";
import { Project, Team } from "@/types";
import { Calendar, Users, Settings, MoreHorizontal, ArrowLeft, UsersRound, Pencil, Trash } from "lucide-react"
import Link from "next/link";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { UpdateProjectModal } from "../modals/update-project-modal";
import { AlertDialog,AlertDialogHeader, AlertDialogFooter,AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useSpecProject } from "@/hooks/use-projects";

type ProjectHeaderProps = {
  project: Project
  taskLength:number
  completedTasks:number
  role:Role

};


export function ProjectHeader({project,taskLength,completedTasks,role}:ProjectHeaderProps,) {
  const {teamData,teamLoading,teamError} =useTeamData(project.teamOwner)
  const {deleteProject,isDeleting, updateProject, isUpdating}=useSpecProject(project.id)
  const router = useRouter();
  const[openDiag,setOpenDiag] = useState(false)
  
  if (teamLoading) return <p>Loading...</p>;
  //if (teamError) return <p>Failed to load projects {error.message}</p>;
  if (!teamData) return <p>Failed to load projects</p>;
  const completionRatio =
  taskLength > 0 && !isNaN(completedTasks)
    ? Math.round((completedTasks / taskLength) * 100) / 100
    : 0;  




  

  const delProjectHandler = async () => { 
    try {
      await deleteProject(project.id); // your API/mutation call
      router.push("/projects");     // navigate back to teams page
    } catch (err) {
      console.error("Failed to delete team:", err);
    }
  }

  return (
    <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
      
            <div className="flex items-center space-x-2 mb-2">
              <Link
              href="/projects"
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
              <div className={`w-3 h-3 bg-${project.color} rounded-full`} />
              <h1 className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">{project.name}</h1>
            </div>

          <p className="text-payne's_gray-500 dark:text-french_gray-400 mb-4">
            {project.description}
          </p>

          <div className="flex items-center space-x-6 text-sm text-payne's_gray-500 dark:text-french_gray-400">
            <div className="flex items-center">
              <Link
                href={`/team/${teamData.id}`}
                className="px-2 py-1 flex flex-row gap-2 items-center text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <UsersRound size={16} className="mr-1" />
                {teamData.teamName}
              </Link>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Due {project.due_date?.toLocaleDateString()}
            </div>
            <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                taskLength === 0 ? "bg-gray-400" : "bg-green-500"
              }`}
            />
            {taskLength === 0
              ? "No tasks"
              : `${completionRatio*100}% complete`}
          </div>

          </div>
        </div>

        <div className="flex items-center space-x-2">

          {hasProjectPermission(role,"edit/delete") &&
          <Dialog open={openDiag} onOpenChange={setOpenDiag}>
            <DropdownMenu >
            <DropdownMenuTrigger ><MoreHorizontal size={16} /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
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
            <UpdateProjectModal updateProject={updateProject} isUpdating={isUpdating} projectData={project} setOpen={setOpenDiag}/>

          </Dialog>
        
        }
        </div>
      </div>
    </div>
  )
}

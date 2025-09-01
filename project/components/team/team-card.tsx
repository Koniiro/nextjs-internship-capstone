import { useTeams } from "@/hooks/use-teams";
import { Team } from "@/types"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { UpdateTeamModal } from "../modals/update-team-modal";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface TeamCardProps{
    team:Team
    managerRole:boolean
}

export default function TeamCard({team,managerRole}:TeamCardProps){
    let { deleteTeam} = useTeams();
    const[openDiag,setOpenDiag] = useState(false)
    


    const delTeamHandler = async () => { 
        deleteTeam(team.id)
    }
    return <div
    className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
            
            <div>
                <Link href={`/team/${team.id}`}>
                    <h3 className=" capitalize font-medium hover:underline hover:font-bold hover:text-outer_space-700 dark:text-platinum-500">
                        {team.teamName}
                    </h3>
                </Link>
               
            </div>
            </div>
            {managerRole && <Dialog open={openDiag} onOpenChange={setOpenDiag}>
                <DropdownMenu>
                <DropdownMenuTrigger ><MoreHorizontal size={16} /></DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem  className="cursor-pointer hover:bg-muted">
                        <DialogTrigger className=" flex flex-row items-center gap-2">
                            <Pencil size={16}/> Edit Team
                        </DialogTrigger>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                    <Trash size={16} />
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className=" text-red-600 flex flex-row items-center gap-2"> <Trash size={16} />Delete this Team</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. All projects and Tasks related to this team will be lost.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className=" text-red-600 hover:bg-red-50 dark:hover:bg-red-900"onClick={delTeamHandler}>
                                    Yes, Remove.
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                    </DropdownMenuGroup>

                    
                </DropdownMenuContent>
                </DropdownMenu>
                <UpdateTeamModal team={team}  setOpen={setOpenDiag}/>
                
            </Dialog>}
            
        </div>


        <div className="flex items-center justify-between">
            <div className="flex flex-row gap-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Active
                </span>
                {managerRole && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        TM
                    </span>
                )}

            </div>
            <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                {Math.floor(Math.random() * 10) + 1} projects
            </div>
        </div>
    </div>

}
import { useTeams } from "@/hooks/use-teams";
import { Team } from "@/types"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { UpdateTeamModal } from "../modals/update-team-modal";

interface TeamCardProps{
    team:Team
}

export default function TeamCard({team}:TeamCardProps){
    let { deleteTeam} = useTeams();
    const[openDiag,setOpenDiag] = useState(false)
    


    const delTaskHandler = async () => { 
        deleteTeam(team.id)
    }
    return <div
    className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
            
            <div>
                <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">{team.teamName}</h3>
               
            </div>
            </div>
            <Dialog open={openDiag} onOpenChange={setOpenDiag}>
                <DropdownMenu>
                <DropdownMenuTrigger ><MoreHorizontal size={16} /></DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
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

                    
                </DropdownMenuContent>
                </DropdownMenu>
                <UpdateTeamModal team={team} setOpen={setOpenDiag}/>
                
            </Dialog>
        </div>


        <div className="flex items-center justify-between">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Active
            </span>
            <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
            {Math.floor(Math.random() * 10) + 1} projects
            </div>
        </div>
    </div>

}
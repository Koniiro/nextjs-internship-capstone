"use client"
import {  Plus, UserPlus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { CreateProjectForm } from '../forms/create-project-form';
import { Button } from "../ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useColumns } from "@/hooks/use-columns";
import { CreateColumnForm } from "../forms/create-col-form";
import { useState } from "react";
import { open } from "node:inspector/promises";
import { useTeams } from "@/hooks/use-teams";
import { CreateTeamForm } from "../forms/create-team-form";

type CreateTeamModalpProps = {
    
};

export  function CreateTeamModal({}:CreateTeamModalpProps) {
    const[openDiag,setOpenDiag] = useState(false)
    const {createTeam,isCreating}=useTeams();
    return (
        <Dialog open={openDiag} onOpenChange={setOpenDiag}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer nline-flex items-center px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors">
                    <UserPlus size={20} className="mr-2" />
                    Create Team
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
            <DialogHeader>
            <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Create Team</DialogTitle>

            </DialogHeader>
            <CreateTeamForm setOpen={setOpenDiag} createTeam={createTeam}/>
            
            <DialogFooter className="flex flex-col gap-3 sm:flex-row">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                
            </DialogClose>
            
            <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="create-team-form">
                {isCreating ? "Creating..." : "Create Team"}
            </Button>
            
            </DialogFooter>
            
        </DialogContent>
        
                
        </Dialog>
    
  )
}

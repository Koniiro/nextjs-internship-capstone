"use client"
import {  UserPlus, UserRoundPlus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTeams } from "@/hooks/use-teams";
import { CreateTeamForm } from "../forms/create-team-form";
import { AddTeamMembertForm } from "../forms/add-team-member-form";
import { useTeamMembers } from "@/hooks/use-team-members";

type AddTeamMemberModalpProps = {
    teamID:string
    
};

export  function AddTeamMemberModal({teamID}:AddTeamMemberModalpProps) {
    const[openDiag,setOpenDiag] = useState(false)
    const {addTeamMember, isInviting} = useTeamMembers(teamID)
    

    return (
        <Dialog open={openDiag} onOpenChange={setOpenDiag}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer nline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-700 hover:text-white ">
                    <UserRoundPlus size={20} className="mr-2" />
                    Add Member
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
            <DialogHeader>
            <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Add Team Member</DialogTitle>
            <DialogDescription>
                Input the user's email to add them to the team.
            </DialogDescription>
            </DialogHeader>
            <AddTeamMembertForm setOpen={setOpenDiag} addTeamMember={addTeamMember} />
            
            <DialogFooter className="flex flex-col gap-3 sm:flex-row">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                
            </DialogClose>
            
            <Button disabled={isInviting} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="add-member-form">
                {isInviting ? "Adding..." : "Add Member"}
            </Button>
            
            </DialogFooter>       
        </DialogContent>         
        </Dialog>
  )
}

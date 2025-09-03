"use client"
import {  DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useColumns } from "@/hooks/use-columns";
import { Column, Team } from "@/types";
import { UpdateColumnForm } from "../forms/update-col-form";
import { useState } from "react";
import { UpdateTeamForm } from "../forms/update-team-form";
import { updateTeam } from '../../actions/team_actions';
import { useTeams } from "@/hooks/use-teams";
import { DialogDescription } from "@radix-ui/react-dialog";

type UpdateTeamModalpProps = {
  team:Team
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

export  function UpdateTeamModal({team,setOpen}:UpdateTeamModalpProps) {
    const {updateTeam,isUpdating}=useTeams();
  
  return (
    <DialogContent  className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Edit Team</DialogTitle>
          <DialogDescription>Edit your team's details</DialogDescription>
        </DialogHeader>
        <UpdateTeamForm teamData={team} setOpen={setOpen} updateTeam={updateTeam}/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
      
            <Button disabled={isUpdating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form={`update-team-form-${team.id}`}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
         
        </DialogFooter>
        
    </DialogContent>
  )
}

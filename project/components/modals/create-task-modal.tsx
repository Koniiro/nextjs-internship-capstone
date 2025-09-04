

"use client"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useProjectTasks } from "@/hooks/use-tasks";
import { CreateTaskForm } from "../forms/create-task-form";
import { useState } from "react";
import { teamMember } from "@/types";

type CreateTaskModalpProps = {
  projectId:string
  colId: number;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>
  teamMembers:teamMember[]

};


export  function CreateTaskModal({ colId,projectId,setLocked,teamMembers }: CreateTaskModalpProps) {
  const [isOpen,setIsOpen] = useState(false)
    const {
    
      isCreating

    } = useProjectTasks(projectId);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);   // controls modal visibility
        setLocked(open);   // lock/unlock while modal is open
      }}>
        <DialogTrigger className="w-full p-3 border-2 border-dashed border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
          + Add Task 
        </DialogTrigger>
        <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">New Task</DialogTitle>
        </DialogHeader>
        <CreateTaskForm teamMembers={teamMembers} colId={colId} projectId={projectId} setOpen={setIsOpen} setLocked={setLocked}/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          
          <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form={`create-project-form-${colId}`}>
            {isCreating ? "Creating..." : "Add Task"}
          </Button>
       
        </DialogFooter>
        
      </DialogContent>
     
            
    </Dialog>
    
  )
}

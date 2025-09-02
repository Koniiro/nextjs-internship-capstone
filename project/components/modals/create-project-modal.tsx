// TODO: Task 4.1 - Implement project CRUD operations
// TODO: Task 4.4 - Build task creation and editing functionality


/*
TODO: Implementation Notes for Interns:

Modal for creating new projects with form validation.

Features to implement:
- Form with project name, description, due date
- Zod validation
- Error handling
- Loading states
- Success feedback
- Team member assignment
- Project template selection

Form fields:
- Name (required)
- Description (optional)
- Due date (optional)
- Team members (optional)
- Project template (optional)
- Privacy settings

Integration:
- Use project validation schema from lib/validations.ts
- Call project creation API
- Update project list optimistically
- Handle errors gracefully
*/
"use client"
import {  Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { CreateProjectForm } from '../forms/create-project-form';
import { Button } from "../ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useState } from "react";
import { TeamPermissionStruct } from "@/types";
import { ScrollArea } from "../ui/scroll-area";

interface CreateProjectModalProps{
    userTeams:TeamPermissionStruct[]

}

export  function CreateProjectModal({userTeams}:CreateProjectModalProps) {
    const[openDiag,setOpenDiag] = useState(false)
  
    const {

      isCreating

    } = useProjects();
  
  return (
    <Dialog open={openDiag} onOpenChange={setOpenDiag}>
        <DialogTrigger className="inline-flex items-center px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors">
            <Plus size={20} className="mr-2" />
            New Project
        </DialogTrigger>
        <DialogContent className="bg-white my-3">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Create a New Project</DialogTitle>
          <DialogDescription className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">
            Ready to start a new project?
          </DialogDescription>
        </DialogHeader>
        <ScrollArea  className="h-72 w-full rounded-md border">
          <div className="p-4">
            <CreateProjectForm setOpen={setOpenDiag} userTeam={userTeams}/>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          
          <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="create-project-form">
            {isCreating ? "Creating..." : "Create Project"}
          </Button>
        
        </DialogFooter>
        
      </DialogContent>
     
            
    </Dialog>
    
  )
}

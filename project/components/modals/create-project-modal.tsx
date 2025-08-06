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



export  function CreateProjectModal() {
    const {

      isCreating

    } = useProjects();
  
  return (
    <Dialog>
        <DialogTrigger className="inline-flex items-center px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors">
            <Plus size={20} className="mr-2" />
            New Project
        </DialogTrigger>
        <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Create a New Project</DialogTitle>
          <DialogDescription className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">
            Ready to start a new project?
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="create-project-form">
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </DialogClose>
        </DialogFooter>
        
      </DialogContent>
     
            
    </Dialog>
    
  )
}

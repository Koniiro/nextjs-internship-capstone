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
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { UpdateProjectForm } from "../forms/update-project-form";
import { Project, ProjectCreator } from "@/types";
import { ScrollArea } from "../ui/scroll-area";

type UpdateProjectModalProps = {
  projectData: Project;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  updateProject: (projectId: string, newProjectData: ProjectCreator) => void;
  isUpdating:boolean


};

export  function UpdateProjectModal( { projectData,setOpen,isUpdating,updateProject }: UpdateProjectModalProps) {

  
  return (
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Update your project</DialogTitle>
        <DialogDescription className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">
          Need to change a few things?
        </DialogDescription>
      </DialogHeader>
      <ScrollArea  className="h-72 w-full rounded-md border">
        <div className="p-4">
          <UpdateProjectForm updateProject={updateProject}projectData={projectData} setOpen={setOpen}/>

        </div>
      </ScrollArea>
      <DialogFooter className="flex flex-col gap-3 sm:flex-row">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        
        <Button disabled={isUpdating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form={`update-project-form-${projectData.id}`}>
          {isUpdating ? "Updating..." : "Update Project"}
        </Button>
        
      </DialogFooter>
      
    </DialogContent>
  )
}

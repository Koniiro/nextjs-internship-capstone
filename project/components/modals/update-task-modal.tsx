// TODO: Task 4.4 - Build task creation and editing functionality
// TODO: Task 5.6 - Create task detail modals and editing interfaces

/*
TODO: Implementation Notes for Interns:

Modal for creating and editing tasks.

Features to implement:
- Task title and description
- Priority selection
- Assignee selection
- Due date picker
- Labels/tags
- Attachments
- Comments section (for edit mode)
- Activity history (for edit mode)

Form fields:
- Title (required)
- Description (rich text editor)
- Priority (low/medium/high)
- Assignee (team member selector)
- Due date (date picker)
- Labels (tag input)
- Attachments (file upload)

Integration:
- Use task validation schema
- Call task creation/update API
- Update board state optimistically
- Handle file uploads
- Real-time updates for comments
*/

"use client"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useProjectTasks } from "@/hooks/use-tasks";
import { Task } from "@/types";
import { UpdateTaskForm } from "../forms/update-task-form";

type UpdateTaskModalpProps = {
  task: Task;
  projectId:string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>

};


export  function UpdateTaskModal({ task,setOpen,projectId }: UpdateTaskModalpProps) {
 
    const {

      isCreating

    } = useProjectTasks(projectId);
  
  return (
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Edit Task</DialogTitle>
        </DialogHeader>
        <UpdateTaskForm task={task} setOpen={setOpen} projectId={projectId}/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        
          <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form={`update-task-form-${task.id}`}>
            {isCreating ? "Saving..." : "Save"}
          </Button>
          
        </DialogFooter>
        
      </DialogContent>
  )
}

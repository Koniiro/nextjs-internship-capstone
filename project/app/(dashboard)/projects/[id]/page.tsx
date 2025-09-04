"use client"
import { useSpecProject } from "@/hooks/use-projects"
import { use } from 'react'
import { KanbanBoard } from "@/components/ui/kaban_ui/kanban-board"
import { CreateColumnModal } from "@/components/modals/create-col-modal"
import { ProjectHeader } from "@/components/project/project-header"
import { SheetProvider } from "@/components/tasks/task-sheet-context"
import TaskSheetRoot from "@/components/tasks/task-content-view"


import { useProjectTasks } from "@/hooks/use-tasks"
import { UpdateTaskModalProvider } from "@/components/tasks/task-update-modal-context"
import { UpdateTaskModal } from "@/components/modals/update-task-modal"
import { useTeamData } from "@/hooks/use-teams"
import { hasProjectPermission, Role } from "@/lib/role_perms"
import { useTeamMembers } from "@/hooks/use-team-members"


export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const { project, isLoading, error } = useSpecProject(id);
  const { projectTasks, openTask, closeTask, isOpening, isClosing } = useProjectTasks(id);

  if (isLoading ) return <p>Loading...</p>;
  if (error) return <p>Failed to load projects {error.message}</p>;
  if (!project || !projectTasks) return <p>Failed to load projects</p>;



  
  const completedTasks = projectTasks.filter(p => p.openStatus === false).length;
  const taskLength=projectTasks.length

  
  function isRole(value: string): value is Role {
    return [
      "Developer",
      "QA",
      "Scrum Master",
      "Product Owner",
      "Designer",
      "DevOps",
      "Business Analyst",
      "Team Leader",
    ].includes(value);
  }

  let role: Role;

  if (isRole(project.role)) {
    role = project.role; // ✅ safe
  } else {
    throw new Error(`Invalid role: ${project.role}`);
  }
  
  return (
    <SheetProvider>
      <UpdateTaskModalProvider>
        <div className="space-y-6">
          {/* Project Header */}

          <ProjectHeader project={project.projectData} taskLength={taskLength} completedTasks={completedTasks} role={role}/>
          {hasProjectPermission(role,"manageBoard") &&
            <CreateColumnModal projectId={id}/>
          }
          <KanbanBoard teamId={project.projectData.teamOwner}projectId={project.projectData.id} projectTasks={projectTasks} role={role}/>
          <TaskSheetRoot isClosing={isClosing} isOpening={isOpening} openTask={openTask} closeTask={closeTask}/>
          {hasProjectPermission(role,"updateTask") &&
            <UpdateTaskModal  projectId={id} projectOwnerTeam={project.projectData.teamOwner}/>
          }
        </div>
      </UpdateTaskModalProvider>
    </SheetProvider>
      
  )
}

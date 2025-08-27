"use client"
import { useSpecProject } from "@/hooks/use-projects"
import { use } from 'react'
import { KanbanBoard } from "@/components/ui/kaban_ui/kanban-board"
import { CreateColumnModal } from "@/components/modals/create-col-modal"
import { ProjectHeader } from "@/components/project/project-header"
import { SheetProvider } from "@/components/task-sheet-context"
import TaskSheetRoot from "@/components/tasks/task-content-view"
import { useProjectTasks } from "@/hooks/use-tasks"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const { project, isLoading, error } = useSpecProject(id);
  let { projectTasks } = useProjectTasks(id);
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load projects {error.message}</p>;
  if (!project || !projectTasks) return <p>Failed to load projects</p>;
  
  const completedTasks = projectTasks.filter(p => p.openStatus === false).length;
  const taskLength=projectTasks.length
  
  return (
    <SheetProvider>
        <div className="space-y-6">
          {/* Project Header */}
          <ProjectHeader project={project} taskLength={taskLength} completedTasks={completedTasks}/>
          <CreateColumnModal projectId={id}/>
          <KanbanBoard projectId={project?.id} projectTasks={projectTasks}/>
          <TaskSheetRoot />
      </div>
    </SheetProvider>
      
  )
}

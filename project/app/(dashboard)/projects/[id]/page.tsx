"use client"
import { ArrowLeft, Settings, Users, Calendar, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useSpecProject } from "@/hooks/use-projects"
import { use } from 'react'
import ProjectStatusChip from "@/components/project/project-status-chip"
import { KanbanBoard } from "@/components/ui/kaban_ui/kanban-board"
import { CreateColumnModal } from "@/components/modals/create-col-modal"
import { ProjectHeader } from "@/components/project/project-header"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const { project, isLoading, error } = useSpecProject(id);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load projects {error.message}</p>;
  if (!project) return <p>Failed to load projects</p>;
  





  
  return (
      <div className="space-y-6">
        {/* Project Header */}
        <ProjectHeader project={project}/>

        {/* Implementation Tasks Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            🎯 Kanban Board Implementation Tasks
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Task 5.1: Design responsive Kanban board layout</li>
            <li>• Task 5.2: Implement drag-and-drop functionality with dnd-kit</li>
            <li>• Task 5.4: Implement optimistic UI updates for smooth interactions</li>
            <li>• Task 5.6: Create task detail modals and editing interfaces</li>
          </ul>
        </div>
        <CreateColumnModal projectId={id}/>
          <KanbanBoard projectId={project?.id}/>
        
          
      </div>
  )
}

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
        <CreateColumnModal projectId={id}/>
        <KanbanBoard projectId={project?.id}/>
      </div>
  )
}

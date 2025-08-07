import { ProjectCardProps } from "@/components/project-card";
import { Project } from "@/types";

export function mapProjectsToCardProjects(projects: Project[]): ProjectCardProps["project"][] {
  return projects.map((proj) => ({
    id: proj.id,
    projectOwner:proj.projectOwner,
    name: proj.name,
    description: proj.description ?? undefined,
    progress: 0,
    created_at:proj.created_at,
    updated_at:proj.updated_at,
    due_date: proj.due_date,
    color: proj.color,
    statusId: proj.statusId,
  }));
}
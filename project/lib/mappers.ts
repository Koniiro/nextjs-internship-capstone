import { ProjectCardProps } from "@/components/project-card";
import { Project } from "@/types";

export function mapProjectsToCardProjects(projects: Project[]): ProjectCardProps["project"][] {
  return projects.map((proj) => ({
    id: proj.id,
    name: proj.name,
    description: proj.description ?? undefined,
    progress: 0,
    dueDate: proj.due_date,
    color: proj.color,
    status: proj.statusId,
  }));
}
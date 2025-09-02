import { ProjectCardProps } from "@/components/project/project-card";
import { Project, TeamProjectsStruct } from "@/types";

export function mapProjectsToCardProjects(teamProjects: TeamProjectsStruct[]): ProjectCardProps["project"][] {
  return teamProjects.flatMap(({ team, projects }) =>
    projects.map((proj) => ({
      id: proj.id,
      projectOwner: proj.projectOwner,
      teamOwner: proj.teamOwner,
      name: proj.name,
      description: proj.description ?? undefined,
      progress: 0,
      created_at: proj.created_at,
      updated_at: proj.updated_at,
      due_date: proj.due_date,
      color: proj.color,
      statusId: proj.statusId,
      team, // ✅ optional: if you want to keep team info available in card
    }))
  );
}
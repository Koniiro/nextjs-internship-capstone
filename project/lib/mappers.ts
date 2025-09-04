import { ProjectCardProps } from "@/components/project/project-card";
import { Project, ProjectCardHandler, TeamProjectsStruct } from "@/types";

export function mapProjectsToCardProjects(
  teamProjects: TeamProjectsStruct[]
): ProjectCardHandler[] {
  return teamProjects.flatMap(({ team, role, projects }) =>
    projects.map((proj) => ({
      project: {
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
        team, // include team info if needed in the project object
      },
      role, // comes from TeamProjectsStruct
    }))
  );
}
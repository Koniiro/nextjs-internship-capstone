"use client"
import ProjectCard from "./project-card"
import { mapProjectsToCardProjects } from "@/lib/mappers";
import { getUserProjects } from "@/actions/project_actions";
import { useProjects } from "@/hooks/use-projects";


export default  function ProjectGrid() {

  const { projects, isLoading, error } = useProjects();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load projects {error.message}</p>;


  const cardData = mapProjectsToCardProjects(projects?? []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {cardData.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
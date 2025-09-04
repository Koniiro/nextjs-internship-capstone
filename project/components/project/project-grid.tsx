"use client"
import ProjectCard from "./project-card"
import { mapProjectsToCardProjects } from "@/lib/mappers";
import { getUserProjects } from "@/actions/project_actions";
import { useProjects } from "@/hooks/use-projects";
import { de } from "zod/v4/locales";
import { Project, ProjectCardHandler, ProjectCreator, TeamProjectsStruct } from "@/types";

type ProjectGridProps = {

  projectArray: ProjectCardHandler[]
  deleteProject:(id: string) => void
  updateProject:(id: string, data: ProjectCreator) => void
  isUpdating:boolean
};

export default  function ProjectGrid({projectArray,deleteProject,updateProject,isUpdating}:ProjectGridProps) {

  //const cardData = mapProjectsToCardProjects(projects?? []);
  if(projectArray.length===0){
    return <p>No projects can be found that fit your search parameters</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {projectArray.map((project) => (
        <ProjectCard isUpdating={isUpdating} key={project.project.id} projectData={project} onDelete={(id:string)=>{deleteProject(id)}} onEdit={(id:string, data:ProjectCreator)=>{updateProject(id,data)}} />
      ))}
    </div>
  );
}
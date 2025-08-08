
import { Project } from "@/types";
import { Calendar, Users, Settings, MoreHorizontal, ArrowLeft } from "lucide-react"
import Link from "next/link";

type ProjectHeaderProps = {
  project: Project;
};


export function ProjectHeader({project}:ProjectHeaderProps) {
  return (
    <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
      
            <div className="flex items-center space-x-2 mb-2">
              <Link
              href="/projects"
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
              <div className="w-3 h-3 bg-blue_munsell-500 rounded-full" />
              <h1 className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">Website Redesign</h1>
            </div>

          <p className="text-payne's_gray-500 dark:text-french_gray-400 mb-4">
            Complete overhaul of company website with modern design and improved user experience
          </p>

          <div className="flex items-center space-x-6 text-sm text-payne's_gray-500 dark:text-french_gray-400">
            <div className="flex items-center">
              <Users size={16} className="mr-2" />5 members
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Due Feb 15, 2024
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              75% complete
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
{/*<div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
            <div>
              <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Project: {project?.name}</h1>
              <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                {project?.description}
              </p>
              <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                Due Date: {project?.due_date ? project.due_date.toLocaleDateString() : "No due date set"}
              </p>
              <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                Created On: {project?.created_at.toLocaleDateString()}  Last Updated: {project?.updated_at.toLocaleDateString()}
              </p>
            </div>

          </div>

          <div className="flex items-center space-x-2">
            <ProjectStatusChip statusId={project?.statusId||5} />
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Users size={20} />
            </button>
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Calendar size={20} />
            </button>
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>*/}
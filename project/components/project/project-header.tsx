
import { Project } from "@/types";
import { Calendar, Users, Settings, MoreHorizontal, ArrowLeft } from "lucide-react"
import Link from "next/link";

type ProjectHeaderProps = {
  project: Project
  taskLength:number
  completedTasks:number
};


export function ProjectHeader({project,taskLength,completedTasks}:ProjectHeaderProps) {

const completionRatio =
  taskLength > 0 && !isNaN(completedTasks)
    ? Math.round((completedTasks / taskLength) * 100) / 100
    : 0;  
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
              <div className={`w-3 h-3 bg-${project.color} rounded-full`} />
              <h1 className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">{project.name}</h1>
            </div>

          <p className="text-payne's_gray-500 dark:text-french_gray-400 mb-4">
            {project.description}
          </p>

          <div className="flex items-center space-x-6 text-sm text-payne's_gray-500 dark:text-french_gray-400">
            <div className="flex items-center">
              <Users size={16} className="mr-2" />X members
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Due {project.due_date?.toLocaleDateString()}
            </div>
            <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                taskLength === 0 ? "bg-gray-400" : "bg-green-500"
              }`}
            />
            {taskLength === 0
              ? "No tasks"
              : `${completionRatio}% complete`}
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

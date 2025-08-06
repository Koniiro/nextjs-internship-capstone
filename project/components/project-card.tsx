'use client'
import { Project } from '../types/index';
import { Calendar, Users, MoreHorizontal } from "lucide-react"
import { Button } from './ui/button';

// TODO: Task 4.5 - Design and implement project cards and layouts

/*
TODO: Implementation Notes for Interns:

This component should display:
- Project name and description
- Progress indicator
- Team member count
- Due date
- Status badge
- Actions menu (edit, delete, etc.)

Props interface:
interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    progress: number
    memberCount: number
    dueDate?: Date
    status: 'active' | 'completed' | 'on-hold'
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

Features to implement:
- Hover effects
- Click to navigate to project board
- Responsive design
- Loading states
- Error states
*/

const statusI=["Review","In Progress", "On-hold","Completed","Starting"]
export interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string 
    progress: number
    dueDate?: Date
    color:string
    status:number
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function ProjectCard({project}:ProjectCardProps) {
  return (
    <div key={project.id}
          className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-3 h-3 rounded-full ${project.color}`} />
        <button className="p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">{project.name}</h3>

      <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4">
        <div className="flex items-center">
          <Users size={16} className="mr-1" />
          X members
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          {project.dueDate?.toDateString()}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-payne's_gray-500 dark:text-french_gray-400">Progress</span>
          <span className="text-outer_space-500 dark:text-platinum-500 font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${project.color}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
              project.status === 2
                ? "bg-blue_munsell-100 text-blue_munsell-700 dark:bg-blue_munsell-900 dark:text-blue_munsell-300"
                : project.status === 1
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                : project.status === 4
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {statusI[project.status-1]}
        </span>
        <div>
          <Button>Delete</Button>
          <Button>Update</Button>
        </div>
      </div>
    </div>
  )
}

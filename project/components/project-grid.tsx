import { Calendar, Users, MoreHorizontal } from "lucide-react"
import ProjectCard, { ProjectCardProps } from "./project-card"


type Project = ProjectCardProps['project']
const projects:Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved UX",
    progress: 75,
    memberCount: 5,
    dueDate: new Date(1707091200),
    status:  'Review',
    color: "bg-blue_munsell-500",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "iOS and Android app development for customer portal",
    progress: 45,
    memberCount: 8,
    dueDate: new Date(1707091200),
    status: "On-hold",
    color: "bg-green-500",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q1 marketing campaign planning and execution",
    progress: 100,
    memberCount: 3,
    dueDate: new Date(1707091200),
    status: "Completed",
    color: "bg-purple-500",
  },
  {
    id: "4",
    name: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure",
    progress: 30,
    memberCount: 4,
    dueDate: new Date(1707091200),
    status: "In Progress",
    color: "bg-orange-500",
  },
  {
    id: "5",
    name: "Security Audit",
    description: "Comprehensive security audit and vulnerability assessment",
    progress: 60,
    memberCount: 2,
    dueDate: new Date(1707091200),
    status:  'In Progress',
    color: "bg-red-500",
  },
  {
    id: "6",
    name: "API Documentation",
    description: "Create comprehensive API documentation for developers",
    progress: 85,
    memberCount: 3,
    dueDate: new Date(1707091200),
    status:  'In Progress',
    color: "bg-indigo-500",
  },
]

export function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project}/>
      ))}
    </div>
  )
}

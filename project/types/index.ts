// TypeScript type definitions
// Task 1.3: Set up project structure and folder organization

import middleware from "@/middleware"
import { string } from "zod"

export interface User {
  id: string
  clerkId: string
  email: string
  userName: string
  first_name:string | null
  last_name: string |null
  avatar_url:string |null
  created_at: Date
  updated_at: Date
}

export interface UserCreator {
  clerkId: string
  email: string
  userName: string
  first_name:string | null
  last_name: string |null
  avatar_url:string |null

}

export interface Project {
  id: string
  projectOwner: string
  teamOwner: string
  name: string
  statusId:number
  description: string 
  color:string
  created_at: Date
  updated_at: Date
  due_date?: Date |null
}
export interface ProjectCardHandler{
  project:Project
  role:string
}
export interface ProjectCreator {
  name: string
  description: string
  teamOwner: string
  statusId:number
  color?:string
  dueDate?: Date
}



export interface Column {
  id: number
  name: string
  description: string
  color?:string
  projectId: string
  position: number
  created_at: Date
  updated_at: Date
}
export interface ColumnCreate {
  name: string
  description: string 
  projectId: string
  color?:string
  position:number
}

export interface Task {
  id: number
  columnId: number
  assigneeId: string|null

  title: string
  description: string 
  priority: "low" | "medium" | "high"
  position: number
  openStatus:boolean
  created_at: Date
  updated_at: Date
  due_date: Date|null
  done_date:Date|null
  //comments: Comment[]
}
export interface TaskCreate {
  columnId: number //TODO CONVERT TO REQUIRED
  assigneeId: string |null
  title: string
  description: string
  priority: "low" | "medium" | "high"
  position:number
  due_date:Date|null
}

export interface Comment {
  id: string
  content: string
  task_id: number
  author_id: string
  created_at: Date
  updated_at: Date
}

export interface CommentCreate {
  content: string
  task_id:number

}

export interface Team{
  teamName: string
  id: string
  created_at: Date
  updated_at: Date
  teamCreatorId:string
  teamCreatorName:string
}
export interface TeamCreate {
  team_name: string
}

export interface TeamCreateDataSchema {
  teamName: string
  teamCreatorId:string
  teamCreatorName:string
}

export interface MemberInviteSchema{
  userEmail:string
  role: 
    | "Developer"
    | "QA"
    | "Scrum Master"
    | "Product Owner"
    | "Designer"
    | "DevOps"
    | "Business Analyst";
  teamManager:boolean
}
interface TeamPermission {
  isManager: boolean;
}
export interface TeamPermissionStruct {
  teamData: Team;
  permission: TeamPermission;
}

export interface TeamProjectsStruct {
  team: Team;
  role:string
  projects: Project[];
}

export interface teamMember{
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatar: string | null;
    role: string;
    joinedAt: Date;
    teamManager: boolean;
}
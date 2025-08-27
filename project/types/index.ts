// TypeScript type definitions
// Task 1.3: Set up project structure and folder organization

import middleware from "@/middleware"

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
  name: string
  statusId:number
  description: string 
  color:string
  created_at: Date
  updated_at: Date
  due_date?: Date |null
}
export interface ProjectCreator {
  name: string
  description: string
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

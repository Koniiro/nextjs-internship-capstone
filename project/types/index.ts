// TypeScript type definitions
// Task 1.3: Set up project structure and folder organization

export interface User {
  id: string
  clerkId: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  projectOwner: string
  name: string
  statusId:number
  description?: string |null
  color:string
  created_at: Date
  updated_at: Date
  due_date?: Date |null
}
export interface ProjectCreator {
  name: string
  description?: string
  statusId:number
  color?:string
  dueDate?: Date
}



export interface Column {
  id: number
  name: string
  projectId: string
  position: number|null
  created_at: Date
  updated_at: Date
}
export interface ColumnCreate {
  name: string
  projectId: string
  position?:number
}

export interface Task {
  id: string
  columnId?: string //TODO CONVERT TO REQUIRED
  assigneeId?: string

  title: string
  description?: string
  priority: "low" | "medium" | "high"
  position: number
  
  created_at: Date
  updated_at: Date
  due_date?: Date
  //comments: Comment[]
}
export interface TaskCreate {
  columnId: number //TODO CONVERT TO REQUIRED
  assigneeId?: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  position:number
  due_date?: Date
}

export interface Comment {
  id: string
  content: string
  taskId: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

// Note for interns: These types should match your database schema
// Update as needed when implementing the actual database schema

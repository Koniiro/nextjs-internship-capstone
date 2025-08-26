
import { Task } from "@/types"
import { TaskContentClient } from "./task-content-view"


interface TaskContentProps {
  task: Task
}

export default  function TaskContent({ task }: TaskContentProps) {
   
    return <TaskContentClient task={task}/>
}
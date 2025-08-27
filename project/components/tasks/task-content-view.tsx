"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Task } from "@/types"
import { TaskPriorityBadge, TaskStatusBadge } from "../ui/status_badges"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { useUser } from "@clerk/nextjs"
import { CreateCommentForm } from "../forms/comment-form"
import { ScrollArea } from "../ui/scroll-area"
import { useTaskComments } from "@/hooks/use-comments"
import TaskCommentCard from './task-comment-card';




interface TaskContentClientProps {

  task:Task

}




export  function TaskContentClient( {task }: TaskContentClientProps){
    const { isLoaded, isSignedIn, user } = useUser()
    const {comments, isLoading,error} = useTaskComments(task.id)

  
    
    if (!isLoaded ) {
      return <p>Loading...</p>  // still fetching user
    }

    if (!isSignedIn || !user) {
      return <p>Not signed in</p>
    }

    return(
        <Sheet>
          <SheetTrigger>
            <h4 className="font-medium hover:underline hover:font-bold hover:text-outer_space-700 hover text-outer_space-500 dark:text-platinum-500 text-sm mb-2 cursor-pointer" >
                {task.title}-{task.id}-{task.position}-{task.columnId}
            </h4>
          </SheetTrigger>
          <SheetContent className="bg-white rounded-l-lg border overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-bold text-2xl text-outer_space-500">{task.title} #{task.id}</SheetTitle>
                <ScrollArea>
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 py-2">
                      <TaskStatusBadge status={task.openStatus} size="lg" />
                      <TaskPriorityBadge priority={task.priority} size="lg" />
                    </div>

                    <div className="flex flex-row gap-2">
                      Assignees:
                      <div className="w-6 h-6 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        U
                      </div>
                    </div>

                    <Separator className="my-2 bg-outer_space-200" />

                    <div>{task.description}</div>

                    <div className="my-4 flex flex-col gap-2">
                      <div className="text-lg font-bold text-outer_space-500">
                        Comments
                      </div>
                      <div>
                        {error && <p>Failed to load comments: {error.message}</p>}
                        {!comments && !error && <p>Loading comments...</p>}
                        {comments && comments.length === 0 && <p>No comments yet.</p>}

                        {comments && comments.length > 0 && (
                          <div className="space-y-2">
                            {comments.map((comment) => (
                              <TaskCommentCard key={comment.id} userId={"Hello"} commentData={comment}/>
                             
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-row gap-2 items-center">
                          <Avatar className="h-12 w-12 rounded-full">
                            <AvatarImage src={user.imageUrl} className="rounded-full object-cover"/>
                            <AvatarFallback className="rounded-full">CN</AvatarFallback>
                          </Avatar>
                          <div className="text-md font-medium text-outer_space-500">
                            Add Comments
                          </div>
                      </div>
                      
                      <div>
                        <CreateCommentForm taskId={task.id} />
                      </div>
                      
                      
                    </div>
                  </div>
                </ScrollArea>
                
            </SheetHeader>
          </SheetContent>
        </Sheet>
    )
}
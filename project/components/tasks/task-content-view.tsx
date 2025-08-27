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
import { useTaskSheet } from "../task-sheet-context"








export default function TaskSheetRoot() {
  const { activeTask, setActiveTask } = useTaskSheet();
  if (!activeTask) return null;
  const { isLoaded, isSignedIn, user } = useUser()
  const {comments, isLoading,error} = useTaskComments(activeTask.id)
  if (!isLoaded ) {
    return <p>Loading...</p>  // still fetching user
  }

  if (!isSignedIn || !user) {
    return <p>Not signed in</p>
  }
  return (
    <>
      {activeTask && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 pointer-events-auto" />
          <Sheet open={!!activeTask} onOpenChange={(open) => !open && setActiveTask(null)}>
          <SheetContent className="bg-white rounded-l-lg border overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-bold text-2xl text-outer_space-500">{activeTask.title} #{activeTask.id}</SheetTitle>
                <ScrollArea>
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 py-2">
                      <TaskStatusBadge status={activeTask.openStatus} size="lg" />
                      <TaskPriorityBadge priority={activeTask.priority} size="lg" />
                    </div>

                    <div className="flex flex-row gap-2">
                      Assignees:
                      <div className="w-6 h-6 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        U
                      </div>
                    </div>

                    <Separator className="my-2 bg-outer_space-200" />

                    <div>{activeTask.description}</div>

                    <div className="my-4 flex flex-col gap-4">
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
                              <TaskCommentCard key={comment.id} userId={comment.author_id} commentData={comment}/>
                             
                            ))}
                          </div>
                        )}
                      </div>
                      <Separator className="my-2 border-t-2 border-dashed border-outer_space-200 " />
                      <div className="flex flex-row gap-2 items-center">
                          <Avatar className="h-12 w-12 rounded-full border-outer_space-500 border">
                            <AvatarImage src={user.imageUrl} className="h-12 w-12 rounded-full object-cover"/>
                            <AvatarFallback className="rounded-full">CN</AvatarFallback>
                          </Avatar>
                          <div className="text-md font-medium text-outer_space-500">
                            Add Comments
                          </div>
                      </div>
                      
                      <div>
                        <CreateCommentForm taskId={activeTask.id} />
                      </div>
                      
                      
                    </div>
                  </div>
                </ScrollArea>
                
            </SheetHeader>
          </SheetContent>
        </Sheet>
        </>
      )}
    </>
  );
}
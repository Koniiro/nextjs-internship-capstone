import { commentSchema } from "@/lib/validations";
import { CommentCreate,  } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User } from "@clerk/nextjs/server";
import { useTaskComments } from "@/hooks/use-comments";



type CreateCommentFormProps = {
    taskId: number;
};


export function CreateCommentForm({taskId,}:CreateCommentFormProps){
    const {createComment, isCreating} = useTaskComments(taskId)

    
    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
            defaultValues: {
            content: ""
        }
    })
    async function onSubmit(data: z.infer<typeof commentSchema>) {
        const commentData:CommentCreate={
            task_id:taskId,
            content:data.content,

        }
        console.log("New Comment",commentData)
        
        try {
            await createComment(commentData)
            form.reset(); // clears the "content" field
        } catch (err) {
            console.error(err);
        } 
    }
    return <div className="grid grid-rows-2 gap-2">
        <Form {...form}>
            <form id="create-comment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control} name="content"
                    render={({field})=>(
                        <FormItem className="flex flex-col">
                            <FormControl>
                                <Input placeholder="A serious proposition" {...field} />
                                
                            </FormControl>
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
        <div className=" flex flex-row justify-end ">
            <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="create-comment-form">
                {isCreating ? "Posting..." : "Comment"}
            </Button>
        </div>
        
    </div>
}
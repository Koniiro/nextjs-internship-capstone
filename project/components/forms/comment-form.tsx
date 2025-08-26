import { commentSchema } from "@/lib/validations";
import { CommentCreate,  } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User } from "@clerk/nextjs/server";



type CreateCommentFormProps = {
    taskId: number;
    userId: string 
};


export function CreateCommentForm({taskId,userId}:CreateCommentFormProps){
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
            author_id:userId
        }
        console.log("New Comment",commentData)
        //createCol(newColData) 
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
            <Button  className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="create-comment-form">
                Comment
            </Button>
        </div>
        
    </div>
}
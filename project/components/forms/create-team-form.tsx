import { teamSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { TeamCreate } from "@/types";




type CreateTeamFormProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    createTeam: (teamName:TeamCreate) => void;
};


export function CreateTeamForm({setOpen,createTeam}:CreateTeamFormProps){

    
    const form = useForm<z.infer<typeof teamSchema>>({
        resolver: zodResolver(teamSchema),
            defaultValues: {
            teamName: ""
        }
    })
    async function onSubmit(data: z.infer<typeof teamSchema>) {
        const newTeam:TeamCreate={
            team_name:data.teamName
        }
        
        
        await createTeam(newTeam)
        setOpen(false)
        form.reset(); // clears the "content" field

    }
    return <Form {...form}>
            <form id="create-team-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control} name="teamName"
                    render={({field})=>(
                        <FormItem className="flex flex-col">
                            <FormLabel >Team Name</FormLabel>

                            <FormControl>
                                <Input placeholder="Team UmaPyoi" {...field} />
                                
                            </FormControl>
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
}
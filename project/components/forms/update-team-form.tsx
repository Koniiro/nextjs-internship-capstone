import { teamSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form,FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Team, TeamCreate } from "@/types";




type UpdateTeamFormProps = {
    teamData:Team
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    updateTeam: (teamId: string, newTeamData: TeamCreate) => void;
};


export function UpdateTeamForm({setOpen,updateTeam,teamData}:UpdateTeamFormProps){

    
    const form = useForm<z.infer<typeof teamSchema>>({
        resolver: zodResolver(teamSchema),
            defaultValues: {
            teamName: teamData.teamName
        }
    })
    async function onSubmit(data: z.infer<typeof teamSchema>) {
        const updatedTeam:TeamCreate={
            team_name:data.teamName
        }
        
        try {
            await updateTeam(teamData.id,updatedTeam)
            setOpen(false)
            form.reset(); // clears the "content" field
        } catch (err) {
            console.error(err);
        } 
    }
    return <Form {...form}>
            <form id={`update-team-form-${teamData.id}`} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control} name="teamName"
                    render={({field})=>(
                        <FormItem className="flex flex-col">
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
import { commentSchema, teamMemberSchema } from "@/lib/validations";
import { CommentCreate, MemberInviteSchema,  } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { userRoles } from "@/lib/constants";
import { Checkbox } from "../ui/checkbox";




type AddTeamMembertFormProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    addTeamMember: (data: MemberInviteSchema) => void;


};


export function AddTeamMembertForm({setOpen,addTeamMember}:AddTeamMembertFormProps){

    
    const form = useForm<z.infer<typeof teamMemberSchema>>({
        resolver: zodResolver(teamMemberSchema),
            defaultValues: {
            userEmail: "",
            role:undefined,
            teamManager:false
        }
    })
    async function onSubmit(data: z.infer<typeof teamMemberSchema>) {
        const newMemberData:MemberInviteSchema={
            userEmail:data.userEmail,
            role:data.role,
            teamManager:data.teamManager
        }

        
        try {
            await addTeamMember(newMemberData)
            setOpen(false)
            form.reset(); // clears the "content" field
        } catch (err) {
            console.error(err);
        } 
    }
    return (
        <Form {...form}>
            <form id="add-member-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control} name="userEmail"
                    render={({field})=>(
                        <FormItem className="flex flex-col">
                            <FormLabel>User Email</FormLabel>
                            <FormControl>
                                <Input placeholder="A serious proposition" {...field} />
                                
                            </FormControl>
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control} name="role"
                    render={({field})=>(
                        <FormItem className="flex flex-col">
                            <FormLabel >User Role</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role for this user" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                    {Object.entries(userRoles).map(([role, value]) => (
                                        <SelectItem key={value} value={value} className="cursor-pointer" >
                                        <div className="flex flex-row items-center gap-2">
                                            {role}
                                        </div>                               
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control} name="teamManager"
                    render={({field})=>(
                        <FormItem className="flex flex-col">
                            <FormLabel >User Permissions</FormLabel>

                            <div className="flex flex-row gap-2">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(checked === true)}
                                />
                                <FormLabel >Assign as a Team Manager</FormLabel>

                            </div>
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
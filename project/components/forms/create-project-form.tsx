'use client'
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

import { useForm } from "react-hook-form"

import { projectCreationSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { CalendarIcon, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProjects } from "@/hooks/use-projects";
import { ProjectCreator, TeamPermissionStruct } from "@/types";
import { colors } from "@/lib/constants";

type CreateProjectFormProps = {

  userTeam:TeamPermissionStruct[]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

export function CreateProjectForm({setOpen,userTeam}:CreateProjectFormProps){
    const managerTeams = userTeam.filter(team => team.permission.isManager);

    const managerTeamRecord: Record<string, string> = Object.fromEntries(
      managerTeams.map(team => [team.teamData.teamName, team.teamData.id])
    );

    const {
      createProject,
    } = useProjects();

    const form = useForm<z.infer<typeof projectCreationSchema>>({
        resolver: zodResolver(projectCreationSchema),
          defaultValues: {
          name: "",
          teamOwner:"",
          description: "",
          color: "",
          dueDate: new Date(), 
        }
    })

    async function onSubmit(data: z.infer<typeof projectCreationSchema>) {
      try{
        const newProjData:ProjectCreator={
          name:data.name,
          description:data.description || '',
          teamOwner:data.teamOwner,
          color:data.color,
          dueDate:data.dueDate,
          statusId:5,
        }
        await createProject(newProjData)
        setOpen(false)

      }catch(err){
        console.error("Failed to create project", err);
      }
    
        
    }

    return(
         <Form {...form}>
            <form id="create-project-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <FormField
                control={form.control} name="name"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                        <Input placeholder="a-preposterous-lemming" {...field} />
                       
                    </FormControl>
                    <FormDescription>
                        This is your public display name.
                    </FormDescription>
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control} name="description"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Project Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="I want to make something today.." {...field} />
                    </FormControl>
                    <FormDescription>
                        What's it about?
                    </FormDescription>
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control} name="teamOwner"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Team</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a team for your project" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                            {Object.entries(managerTeamRecord).map(([name, value]) => (
                                <SelectItem key={value} value={value} className="cursor-pointer" >
                                <div className="flex flex-row items-center gap-2">
 
                                    {name}
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
                control={form.control} name="dueDate"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>{field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                        className="bg-white"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                   
                  </FormItem>
              
                )}
              />
              <FormField
                control={form.control} name="color"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Project Color</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a color for your project" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                            {Object.entries(colors).map(([name, value]) => (
                                <SelectItem key={value} value={value} className="cursor-pointer" >
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full bg-${value}`} />
                                    {name}
                                </div>                               
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              
            </form>
          </Form>
    )
}
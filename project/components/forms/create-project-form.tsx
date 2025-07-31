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
import { createProject } from "@/actions/project_actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const colors: Record<string, string> = {
  Red: "bg-red-500",
  Blue: "bg-blue-500",
  Green: "bg-green-500",
  Yellow: "bg-yellow-500",
  Purple: "bg-purple-500",
};

export function CreateProjectForm(){
    const projectschema=projectCreationSchema
    const form = useForm<z.infer<typeof projectschema>>({
        resolver: zodResolver(projectschema),
    })

    async function onSubmit(data: z.infer<typeof projectschema>) {
        
        console.log(data)
        const response=await createProject(data.name,data.description,data.color,data.dueDate)
        console.log("User Creat response:", response);
        
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
                control={form.control} name="color"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Project Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a color for your project" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                            {Object.entries(colors).map(([name, value]) => (
                                <SelectItem key={value} value={value} className="cursor-pointer" >
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${value}`} />
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
              
            </form>
          </Form>
    )
}
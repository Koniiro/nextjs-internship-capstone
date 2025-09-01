"use client"
import { useTeamMembers } from "@/hooks/use-team-members";
import { Settings, MoreHorizontal, ArrowLeft, Pencil, Trash } from "lucide-react"
import Link from "next/link";
import { AddTeamMemberModal } from "../modals/add-team-member";
import { Button } from "../ui/button";
import { Team } from "@/types";
import { useTeamData } from "@/hooks/use-teams";
import { useState } from "react";
import { UpdateTeamForm } from "../forms/update-team-form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

type TeamHeaderProps = {
  teamData: Team
  teamId: string
  teamLoading:boolean
  teamError:Error |null
  userPermissions:boolean
};


export function TeamHeader({teamId,teamData,teamLoading,teamError,userPermissions}:TeamHeaderProps) {
  const {updateTeam,isUpdating}=useTeamData(teamId)
  const [editTitleOpen,setEditTitleOpen]=useState(false)
   
  if (teamLoading) return <p>Loading...</p>;
  if (teamError) return <p>Failed to load team {teamError.message}</p>;
  if (!teamData) return <p>Failed to load team data</p>;
  const delTeamHandler = async () => { 
        //deleteTeam(team.id)
  }
  return (
    <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
      
            <div className="flex items-center space-x-2 mb-2">
              <Link
                href="/team"
                className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
            <div className="w-3 h-3 bg-blue_munsell-500 rounded-full" />
            <div className="flex-row flex gap-4 items-center">
              {!editTitleOpen ? (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
                    {teamData.teamName}
                  </h1>
                  <Button
                    className="text-sm text-white border-2 border-green-700 bg-green-500 hover:bg-green-700 dark:hover:bg-green-200 rounded-lg transition-colors"
                    onClick={() => setEditTitleOpen(true)}
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <UpdateTeamForm
                    teamData={teamData}
                    setOpen={setEditTitleOpen}
                    updateTeam={updateTeam}
                  />
                  <Button
                    onClick={() => setEditTitleOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isUpdating}
                    className="text-sm text-white border-2 border-green-700 bg-green-500 hover:bg-green-700 dark:hover:bg-green-200 rounded-lg transition-colors"
                    type="submit"
                    variant="outline"
                    form={`update-team-form-${teamId}`}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-3"><MoreHorizontal size={18} /></DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuGroup>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                <Trash size={16} />
                                Delete
                            </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className=" text-red-600 flex flex-row items-center gap-2"> <Trash size={16} />Delete this Team</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. All projects and Tasks related to this team will be lost.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className=" text-red-600 hover:bg-red-50 dark:hover:bg-red-900"onClick={delTeamHandler}>
                                Yes, Remove.
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>     
            </div>
        </div>
        {userPermissions && <div className="flex items-center space-x-2">
          <AddTeamMemberModal teamID={teamId}/>
          
        </div>}
        
      </div>
    </div>
  )
}
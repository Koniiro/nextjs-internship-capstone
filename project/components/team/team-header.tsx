"use client"
import { useTeamMembers } from "@/hooks/use-team-members";
import { Settings, MoreHorizontal, ArrowLeft } from "lucide-react"
import Link from "next/link";
import { AddTeamMemberModal } from "../modals/add-team-member";
import { Button } from "../ui/button";
import { Team } from "@/types";

type TeamHeaderProps = {
  teamData: any
  teamId: string
  teamLoading:boolean
  teamError:Error |null
};


export function TeamHeader({teamId,teamData,teamLoading,teamError}:TeamHeaderProps) {
    if (teamLoading) return <p>Loading...</p>;
    if (teamError) return <p>Failed to load team {teamError.message}</p>;
    if (!teamData) return <p>Failed to load team data</p>;

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
            <h1 className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">{teamData.teamName}</h1>
            <Button  className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </Button>
            </div>
        </div>

        <div className="flex items-center space-x-2">
          <AddTeamMemberModal teamID={teamId}/>
          
        </div>
      </div>
    </div>
  )
}
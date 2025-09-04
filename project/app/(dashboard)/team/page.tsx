"use client"
import { CreateColumnModal } from "@/components/modals/create-col-modal";
import { CreateTeamModal } from "@/components/modals/create-team-modal";
import TeamCard from "@/components/team/team-card";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useTeams } from "@/hooks/use-teams";
import { UserPlus, Mail, MoreHorizontal } from "lucide-react"

export default function TeamPage() {
  let { userTeams, isLoading: isLoadingTeams, error: errorTeams } = useTeams();
  let { projects, isLoading: isLoadingProjects, error: errorProjects } = useProjects();

  if (isLoadingTeams || isLoadingProjects) return <p>Loading...</p>;

  if (errorTeams) return <p>Failed to load teams {errorTeams.message}</p>;
  if (errorProjects) return <p>Failed to load projects {errorProjects.message}</p>;

  if (!userTeams) return <p>Failed to load teams</p>;
  if (!projects) return <p>Failed to load projects</p>;
  const result=projects.map((entry) => ({
      teamId: entry.team.id,
      projects: entry.projects.map((p) => p.name),
      projectCount: entry.projects.length,
    }));
  
  

  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Teams</h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">Manage the teams you are part off</p>
        </div>
        <CreateTeamModal/>
      </div>
      {userTeams.length > 0 ? (
        // Teams exist → show grid of cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTeams.map((teamRecord, index) => (
            <TeamCard key={index} projectCount={result.find(r => r.teamId === teamRecord.teamData.id)?.projectCount??0} team={teamRecord.teamData} managerRole={teamRecord.permission.isManager} />
          ))}
        </div>
      ) : (
        // No teams → show warning banner
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p>You are not in any team yet.</p>
        </div>
      )}


    </div>
  )
}

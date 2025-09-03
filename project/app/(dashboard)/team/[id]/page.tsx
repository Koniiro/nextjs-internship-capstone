"use client"
import { TeamHeader } from "@/components/team/team-header";
import TeamMemberCard from "@/components/team/team-member-card";
import { useTeamMembers } from "@/hooks/use-team-members";
import { useTeamData } from "@/hooks/use-teams";
import { useUser } from "@clerk/nextjs";
import { use } from "react";


export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); 
    const {teamData,teamLoading,teamError}=useTeamData(id)
    const {teamMembers,membersLoading,membersError,userPermissions,permissionsLoading,permissionsError} =useTeamMembers(id)
    
    const loading =   membersLoading || permissionsLoading;
    const error =   membersError || permissionsError;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Failed: {error.message}</p>;
    if (!teamData || !teamMembers) return <p>No team data</p>;
    if (!userPermissions) return <p>No permissions</p>;

    return(
        <div className="space-y-6">
            <TeamHeader userPermissions={userPermissions} teamId={id} teamData={teamData} teamError={teamError} teamLoading={teamLoading}/>
            {teamMembers.length > 0 ? (
                    // Teams exist → show grid of cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((mem, index) => (
                        <TeamMemberCard key={index}  userPermissions={userPermissions}userID={mem.id} role={mem.role} teamCreator={mem.id === teamData.teamCreatorId} isTeamManager={mem.teamManager} joinedAt={mem.joinedAt} teamId={id} />
                    ))}
                </div>
                ) : (
                // No teams → show warning banner
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p>No members in this team</p>
                </div>
            )}
            
        </div>

    )
}
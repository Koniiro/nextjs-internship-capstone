"use client"
import { TrendingUp, Users, CheckCircle, Clock, Plus, Folder } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { useTeams } from "@/hooks/use-teams";
import { CreateTeamModal } from "@/components/modals/create-team-modal";
import { useProjects } from "@/hooks/use-projects";
import { mapProjectsToCardProjects } from "@/lib/mappers";
import Link from "next/link";
import { useUserTasks } from "@/hooks/use-tasks";

export default function DashboardPage() {
    let {
      userTeams,
      isLoading: isLoadingTeams,
      error: errorTeams,
    } = useTeams();
    const {
      projects,
      isLoading: isLoadingProjects,
      error: errorProjects,
    } = useProjects();

     const {
      userTasks,
      isLoading: isLoadingTasks,
      error: errorTasks,
    } = useUserTasks();

  if (isLoadingTeams || isLoadingProjects||isLoadingTasks) {
    return <p>Loading...</p>;
  }

  // Combine error states
  if (errorTeams || errorProjects||errorTasks) {
    return (
      <p>
        Failed to load {errorTeams ? "Teams" : "Projects"}
        {/* If you want both messages: */}
        {/* {errorTeams && <span>Teams </span>} */}
        {/* {errorProjects && <span>Projects</span>} */}
      </p>
    );
  }

  // Combine null checks
  if (!userTeams || !projects||!userTasks) {
    return <p>Failed to load data</p>;
  } 

  let projectData = mapProjectsToCardProjects(projects?? []);
  const top3Projects = [...projectData] // copy so we don’t mutate original
  .sort((a, b) => {
    const aDate = new Date(a.project.updated_at).getTime();
    const bDate = new Date(b.project.updated_at).getTime();
    return bDate - aDate; // newest first
  })
  .slice(0, 3);
  const doneTasks = userTasks.filter((task) => task.openStatus === true);
  const pendingTasks = userTasks.filter((task) => task.openStatus === false);

  return (

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Dashboard</h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">
            Welcome back! Here's an overview of your projects and tasks.
          </p>
        </div>


        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-outer_space-500 overflow-hidden rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue_munsell-100 dark:bg-blue_munsell-900 rounded-lg flex items-center justify-center">
                  <Folder className="text-blue_munsell-500" size={20} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <Link href={`/projects`}>
                  <dt className="text-sm font-medium hover:underline text-payne's_gray-500 dark:text-french_gray-400 truncate">
                    Active Projects
                  </dt>
                  </Link>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                      {projectData.length}
                    </div>
                    {/*<div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                      {stat.change}
                    </div>*/}
                  </dd>
                  
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-outer_space-500 overflow-hidden rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue_munsell-100 dark:bg-blue_munsell-900 rounded-lg flex items-center justify-center">
                    <Users className="text-blue_munsell-500" size={20} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <Link href={`/team`}>
                  <dt className="text-sm font-medium hover:underline text-payne's_gray-500 dark:text-french_gray-400 truncate">
                    Teams
                  </dt>
                  </Link>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                        {userTeams.length}
                      </div>
                      {/*<div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>*/}
                    </dd>
                    
                  </dl>
                </div>
              </div>
          </div>
          <div className="bg-white dark:bg-outer_space-500 overflow-hidden rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue_munsell-100 dark:bg-blue_munsell-900 rounded-lg flex items-center justify-center">
                    <Users className="text-blue_munsell-500" size={20} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                     Completed Tasks
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                        {doneTasks.length}
                      </div>
                      {/*<div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>*/}
                    </dd>
                    
                  </dl>
                </div>
              </div>
          </div>
          <div className="bg-white dark:bg-outer_space-500 overflow-hidden rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue_munsell-100 dark:bg-blue_munsell-900 rounded-lg flex items-center justify-center">
                    <Clock className="text-blue_munsell-500" size={20} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                     Pending Tasks
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                        {pendingTasks.length}
                      </div>
                      {/*<div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>*/}
                    </dd>
                    
                  </dl>
                </div>
              </div>
          </div>

          
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
            <Link href={`/projects`}>
            <h3 className="text-lg font-semibold text-outer_space-500 hover:underline hover:text-blue-600 dark:text-platinum-500  mb-4">Recent Projects</h3>  
            </Link>
            
            <div className="space-y-3">
                {top3Projects.map((proj, i) => (
                  <div
                    key={proj.project.id ?? i} // use proj.id if available, fallback to index
                    className="flex items-center justify-between p-3 border border-blue_munsell-500 bg-white-800 dark:bg-outer_space-400 rounded-lg"
                  >
                    <div>
                      <Link href={`/projects/${proj.project.id}`}>      
                      <h2 className="text-lg font-medium text-outer_space-500 hover:underline hover:text-blue-600 dark:text-platinum-500 mb-2">{proj.project.name}</h2>
                    </Link>
                      <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                        Last updated {new Date(proj.project.updated_at).toLocaleString()}
                      </div>
                    </div>

                  </div>
                ))}

              
            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
            <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-4">Quick Actions</h3>
            <div className="space-y-3">
             
                <CreateProjectModal  className="w-full" userTeams={userTeams} />
           
              <CreateTeamModal className="w-full"/>
            </div>
            
          </div>
        </div>
      </div>

  )
}

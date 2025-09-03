"use client"
import { Plus, Search, Filter, MoreHorizontal, Pencil, ChevronDown, ArrowDownNarrowWide, Users, BadgeInfo, Check, ArrowDownAZ, ArrowDownZA, CalendarArrowUp, CalendarArrowDown } from "lucide-react"
import  ProjectGrid  from "@/components/project/project-grid"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { useTeams } from "@/hooks/use-teams"
import { useProjects } from "@/hooks/use-projects";
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { TeamProjectsStruct } from "@/types"
import { mapProjectsToCardProjects } from "@/lib/mappers"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { projectStatus } from "@/lib/constants"

export default function ProjectsPage() {
  let {
    userTeams,
    isLoading: isLoadingTeams,
    error: errorTeams,
  } = useTeams();

  const {
    projects,
    isLoading: isLoadingProjects,
    error: errorProjects,
    deleteProject,
    updateProject,
  } = useProjects();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(0);
  const [team, setTeam] = useState("");
  type SortBy = { field: "name" | "dueDate" | ""; direction: 0 | 1 };

  const [sortBy, setSortBy] = useState<SortBy>({ field: "name", direction: 0 });


  if (isLoadingTeams || isLoadingProjects) {
    return <p>Loading...</p>;
  }

  if (errorTeams || errorProjects) {
    return (
      <p>
        Failed to load{" "}
        {errorTeams instanceof Error
          ? `teams: ${errorTeams.message}`
          : errorProjects instanceof Error
          ? `projects: ${errorProjects.message}`
          : "unknown error"}
      </p>
    );
  }

  if (!userTeams || !projects) {
    return (
      <p>Failed to load{" "}</p>
  )}
  

  let projectData = mapProjectsToCardProjects(projects?? []);

  projectData.sort((a, b) => {
    if (sortBy.field ==="name") {
      return sortBy.direction === 0
        ? a.project.name.localeCompare(b.project.name)
        : b.project.name.localeCompare(a.project.name);
    }
    if (sortBy.field ==="dueDate") {
      const aDate = a.project.due_date;
      const bDate = b.project.due_date;
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return sortBy.direction === 0
        ? new Date(aDate).getTime() - new Date(bDate).getTime()
        : new Date(bDate).getTime() - new Date(aDate).getTime();
    }
    return 0;
  });

  
  

  

  const filteredProjects = projectData.filter((proj) =>{

    let searchMatch=true
    
    
    const matchesStatus =
      status === 0 || proj.project.statusId === status;

    // Team (case-insensitive exact match)
    const matchesTeam =
      team === "" ||
      proj.project.teamOwner === team;
    return searchMatch && matchesStatus && matchesTeam;
    
  });
  

  return (

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Projects</h1>
            <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">Manage and organize your team projects</p>
          </div>
          <CreateProjectModal userTeams={userTeams}/>
        </div>

        {/* Implementation Tasks Banner 
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            📋 Projects Page Implementation Tasks
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Task 4.1: Implement project CRUD operations</li>
            <li>• Task 4.2: Create project listing and dashboard interface</li>
            <li>• Task 4.5: Design and implement project cards and layouts</li>
            <li>• Task 4.6: Add project and task search/filtering capabilities</li>
        */}

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-payne's_gray-500 dark:text-french_gray-400"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search projects..."
              value={search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-outer_space-500 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 placeholder-payne's_gray-500 dark:placeholder-french_gray-400 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
            />
          </div>
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="inline-flex items-center px-4 py-2 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors">
                      <ArrowDownNarrowWide  size={16} className="mr-2" />
                      Sort<ChevronDown size={16}  />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Select Order</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          setSortBy((prev) => {
                            if (prev.field !== "name") {
                              // Not sorting by name yet → start ascending
                              return { field: "name", direction: 0 };
                            }
                            if (prev.direction === 0) {
                              // Already ascending → flip to descending
                              return { field: "name", direction: 1 };
                            }
                            // Already descending → reset (no sorting)
                            return { field: "", direction: 0 };
                          })
                        }
                        className={`flex items-center cursor-pointer hover:bg-muted`}
                      >
                        {/* Icon slot */}
                         <span className="flex-shrink-0 w-4 mr-2 flex items-center justify-center">
                          {sortBy.field === "name" && sortBy.direction === 0 && (
                            <ArrowDownAZ className="w-4 h-4" />
                          )}
                          {sortBy.field === "name" && sortBy.direction === 1 && (
                            <ArrowDownZA className="w-4 h-4" />
                          )}
                        </span>
                        <span className={`flex-1 ${sortBy.field==="name" ? "font-bold" : ""}`}>Name</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          setSortBy((prev) => {
                            if (prev.field !== "dueDate") {
                              // Not sorting by name yet → start ascending
                              return { field: "dueDate", direction: 0 };
                            }
                            if (prev.direction === 0) {
                              // Already ascending → flip to descending
                              return { field: "dueDate", direction: 1 };
                            }
                            // Already descending → reset (no sorting)
                            return { field: "", direction: 0 };
                          })
                        }
                        className={`flex items-center cursor-pointer hover:bg-muted `}
                      >
                        {/* Icon slot */}
                        <span className="flex-shrink-0 w-4 mr-2 flex items-center justify-center">
                          {sortBy.field === "dueDate" && sortBy.direction === 0 && (
                            <CalendarArrowDown className="w-4 h-4" />
                          )}
                          {sortBy.field === "dueDate" && sortBy.direction === 1 && (
                            <CalendarArrowUp className="w-4 h-4" />
                          )}
                        </span>
                        <span className={`flex-1 ${sortBy.field==="dueDate" ? "font-bold" : ""}`}> Due Date</span>
                      </DropdownMenuItem>

                       
                    </DropdownMenuGroup>

                    
                </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="inline-flex items-center px-4 py-2 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors">
                      <Users  size={16} className="mr-2" />
                      Team <ChevronDown size={16}  />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>User Teams</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {Object.entries(userTeams).map(([name, value]) =>
                        <DropdownMenuItem
                          key={value.teamData.id}
                          onClick={() =>{
                            setTeam((prev) => (prev === value.teamData.id ? "" : value.teamData.id))
                            console.log(team)}
                          }
                          className={`flex items-center cursor-pointer hover:bg-muted ${team === value.teamData.id ? "font-bold" : ""}`}
                        >
                          {/* Icon slot */}
                          <span className="flex-shrink-0 mr-2 flex w-2  items-center justify-center">
                            {team === value.teamData.id && <Check className="w-4 h-4" />}
                          </span>
                          <span className="flex-1">{value.teamData.teamName}</span>
                        </DropdownMenuItem>
                      
                      
                      )}
                       
                    </DropdownMenuGroup>

                    
                </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
                <DropdownMenuTrigger asChild >
                  <Button className="inline-flex items-center px-4 py-2 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors">
                      <BadgeInfo size={16} className="mr-2" />
                      Status<ChevronDown size={16}  />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Project Status</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {Object.entries(projectStatus).map(([name, value]) =>
                        <DropdownMenuItem
                          key={value}
                          onClick={() =>
                            setStatus((prev) => (prev === value ? 0 : value))
                          }
                          className={`flex items-center cursor-pointer hover:bg-muted ${status === value ? "font-bold" : ""}`}
                        >
                          {/* Icon slot */}
                          <span className="flex-shrink-0 mr-2 flex w-2  items-center justify-center">
                            {status === value && <Check className="w-4 h-4" />}
                          </span>
                          <span className="flex-1">{name}</span>
                        </DropdownMenuItem>
                      
                      
                      )}
                       
                    </DropdownMenuGroup>

                    
                </DropdownMenuContent>
          </DropdownMenu>
        </div>

  
        <ProjectGrid projectArray={filteredProjects} updateProject={updateProject} deleteProject={deleteProject}/>

      
      </div>

  )
}

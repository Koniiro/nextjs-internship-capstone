import { Project, Task } from "@/types";
import { TrendingUp, BarChart3, Users, Clock } from "lucide-react";

type projAnalyticsProps = {
    projectData:Project
    projectTasks:Task[]|undefined


};


export function ProjectAnalytics({ projectTasks,projectData }: projAnalyticsProps) {
    const tasks = projectTasks ?? [];
    const completionRatio = tasks.length === 0 
        ? 0 
        : tasks.filter(task => !task.openStatus).length / tasks.length;


    const averageTaskTime = (() => {
    if (!projectTasks?.length) return 0;

    // filter only tasks with both created_at and done_date
    const validTasks = projectTasks.filter(
        (t) => t.created_at !== null && t.done_date !== null
    );

    if (validTasks.length === 0) return 0;

    // sum differences (in days)
    const totalDays = validTasks.reduce((sum, task) => {
        const created = task.created_at.getTime();
        const done = task.done_date!.getTime();
        const diffDays = (done - created) / (1000 * 60 * 60 * 24);
        return sum + diffDays;
    }, 0);
    console.log(totalDays)

    // return rounded to 1 decimal for nicer display
    return parseFloat((totalDays / validTasks.length).toFixed(1));
    })();

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const completedTasks = projectTasks?.filter(
    (t) => t.done_date && t.done_date >= weekAgo && !t.openStatus
    ) ?? [];

    const velocity = completedTasks.length;


    return(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">Analytics for {projectData.name}</h1>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "Project Velocity", value: velocity, unit: "tasks/week", icon: TrendingUp, color: "blue" },
                      { title: "Team Efficiency", value: `${completionRatio*100}%`, unit: "completion rate", icon: BarChart3, color: "green" },
                      { title: "Avg. Task Time", value: averageTaskTime, unit: "days", icon: Clock, color: "orange" },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-10 h-10 bg-${metric.color}-100 dark:bg-${metric.color}-900 rounded-lg flex items-center justify-center`}
                          >
                            <metric.icon className={`text-${metric.color}-500`} size={20} />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500 mb-1">{metric.value}</div>
                        <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-2">{metric.unit}</div>
                        <div className="text-xs font-medium text-outer_space-500 dark:text-platinum-500">{metric.title}</div>
                      </div>
                    ))}
                  </div>

        </div>
    )
}
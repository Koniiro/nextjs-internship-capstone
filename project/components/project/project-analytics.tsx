import { Project, Task } from "@/types";
import { TrendingUp, BarChart3, Clock,  } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, Pie,PieChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

type projAnalyticsProps = {
    projectData:Project
    projectTasks:Task[]|undefined


};
function formatDate(date: Date):string {
  return date.toISOString().split("T")[0];
}

function buildChartData(tasks: Task[]) {
  const counts: Record<string, { opened: number; closed: number }> = {};

  for (const task of tasks) {
    // count opened
    const createdDate = formatDate(task.created_at);
    counts[createdDate] ??= { opened: 0, closed: 0 };
    counts[createdDate].opened++;

    // count closed
    if (task.done_date) {
      const doneDate = formatDate(task.done_date);
      counts[doneDate] ??= { opened: 0, closed: 0 };
      counts[doneDate].closed++;
    }
  }

  return Object.entries(counts)
    .map(([date, { opened, closed }]) => ({
      date, // already "YYYY-MM-DD"
      opened,
      closed,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

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
    const chartData = [
      { status: "open", tasks: tasks.filter(task => task.openStatus).length, fill: "var(--color-open)" },
      { status: "closed", tasks: tasks.filter(task => !task.openStatus).length, fill: "var(--color-closed)" },

    ]

    const chartConfig = {
      visitors: {
        label: "Visitors",
      },
      open: {
        label: "Open",
        color: "var(--chart-1)",
      },
      closed: {
        label: "Closed",
        color: "var(--chart-2)",
      },
 
     
    } satisfies ChartConfig

    const taskOpenCloseData=buildChartData(tasks)
    const taskOpenCloseChartConfig = {
      opened: {
        label: "Opened",
        color: "var(--chart-1)",
      },
      closed: {
        label: "Closed",
        color: "var(--chart-2)",
      },
  } satisfies ChartConfig

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
            <div className="grid grid-cols-2 gap-6">
              <div>
                    <Card className="flex flex-col bg-white">
                    <CardHeader className="items-center pb-0">
                      <CardTitle>Open - Closed Chart</CardTitle>
                      
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                      <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            
                            content={<ChartTooltipContent className="bg-white" hideLabel />}
                          />
                          <Pie
                            data={chartData}
                            dataKey="tasks"
                            nameKey="status"
                            stroke="0"
                          />
                            <ChartLegend
                            content={<ChartLegendContent nameKey="status" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                          />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
      
                  </Card>
              </div>
              <div>
                <Card className="py-0 bg-white">
                    <CardHeader>
                      <CardTitle>Closed - Opened Tasks</CardTitle>
                      
                    </CardHeader>
                    <CardContent className="px-2 sm:p-6">
                      <ChartContainer
                        config={taskOpenCloseChartConfig}
                        className="aspect-auto h-[250px] w-full"
                      >
                        <BarChart
                          accessibilityLayer
                          data={taskOpenCloseData}
                          margin={{
                            left: 12,
                            right: 12,
                          }}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                              const date = new Date(value)
                              return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            }}
                          />
                          <ChartTooltip
                            
                            content={
                              <ChartTooltipContent
                                className="w-[150px] bg-white"
                                nameKey="status"
                                labelFormatter={(value) => {
                                  return new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                }}
                              />
                            }
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Bar
                            dataKey="opened"
                            stackId="a"
                            fill="var(--color-opened)"
                            radius={[0, 0, 4, 4]}
                            
                          
                        />
                        <Bar
                          dataKey="closed"
                          stackId="a"
                          fill="var(--color-closed)"
                          radius={[4, 4, 0, 0]}
             
                         
                        />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                              

              </div>
            </div>

        </div>
    )
}
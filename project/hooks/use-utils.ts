import { useMemo } from "react";
import { useProjectTasks } from "./use-tasks";


export function useCompletionRatio(projectId: string) {
  const { projectTasks } = useProjectTasks(projectId);

  // Only recompute when projectTasks changes
  const completionRatio = useMemo(() => {
    if (!projectTasks || projectTasks.length === 0) return 0; 
    const completed = projectTasks.filter(t => t.openStatus === false).length;
    return projectTasks.length > 0
      ? Math.round((completed / projectTasks.length) * 100) / 100
      : 0;
  }, [projectTasks]);

  return completionRatio;
}

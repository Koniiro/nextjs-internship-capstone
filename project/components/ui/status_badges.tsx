import { Book, BookCheck } from "lucide-react";
import { Badge } from "./badge"


interface TaskStatusBadgeProps {
  status: boolean;
  size?: "sm" | "md" | "lg"; // 👈 optional size prop
}

export function TaskStatusBadge({ status, size = "md" }: TaskStatusBadgeProps) {
  const statusText = status ? "Open" : "Closed";
  const statusColor = status
    ? "bg-green-100 text-gray-700 dark:bg-green-900"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

  const sizeClasses: Record<typeof size, string> = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const iconSizes: Record<typeof size, number> = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  const statusLogo = status ? (<Book size={iconSize} />) : (<BookCheck size={iconSize} />  );

  return (
    <span
      className={`cursor-default font-medium rounded-full flex flex-row items-center gap-2 ${statusColor} ${sizeClass}`}
    >
      {statusLogo} {statusText}
    </span>
  );
}

interface TaskPriorityBadgeProps {
  priority:string
  size?: "sm" | "md" | "lg"
}
export function TaskPriorityBadge({priority,size= "md"}: TaskPriorityBadgeProps){
    const priorityColors: Record<string, string> = {
        high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
        medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
        low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };
      const sizeClasses: Record<typeof size, string> = {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
    };

    const priorityClass = priorityColors[priority] ?? priorityColors.default;
      const sizeClass = sizeClasses[size];
    
    return(
        <span className={`capitalize cursor-default ${sizeClass} font-medium rounded-full ${priorityClass}`}>
            {priority}
        </span>
    )
}
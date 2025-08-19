"use client"

import { useColumns } from "@/hooks/use-columns"
import { MoreHorizontal } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import KanbanColumn from "./kanban-column"
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable"
import { Column, ColumnCreate, Task } from "@/types"
import {DndContext,PointerSensor,closestCorners, useSensor, useSensors} from "@dnd-kit/core"
import {
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers';
import { useProjectTasks } from "@/hooks/use-tasks"
// TODO: Task 5.1 - Design responsive Kanban board layout
// TODO: Task 5.2 - Implement drag-and-drop functionality with dnd-kit

/*
TODO: Implementation Notes for Interns:

This is the main Kanban board component that should:
- Display columns (lists) horizontally
- Allow drag and drop of tasks between columns
- Support adding new tasks and columns
- Handle real-time updates
- Be responsive on mobile

Key dependencies to install:
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities

Features to implement:
- Drag and drop tasks between columns
- Drag and drop to reorder tasks within columns
- Add new task button in each column
- Add new column functionality
- Optimistic updates (Task 5.4)
- Real-time persistence (Task 5.5)
- Mobile responsive design
- Loading states
- Error handling

State management:
- Use Zustand store for board state (Task 5.3)
- Implement optimistic updates
- Handle conflicts with server state
*/


function projectTaskParser(colId: number, projectTasks?:Record<number, Task[]>) {
  if (!projectTasks) return [];
  return projectTasks[colId] ?? [];
}
export function KanbanBoard({ projectId }: { projectId: string }) {
  const { columns, isLoading, error, updateCol } = useColumns(projectId);
  let { projectTasks } = useProjectTasks(projectId);
  projectTasks = projectTasks ?? [];



  const [dragColumns, setDragColumns] = useState<Column[]>([]);

  useEffect(() => {
    if (!columns) return;

    const sortedServer = [...columns].sort((a, b) => a.position - b.position);
    const sortedLocal = [...dragColumns].sort((a, b) => a.position - b.position);

    const differentContent = JSON.stringify(sortedServer) !== JSON.stringify(sortedLocal);

    if (differentContent) {
      console.log("Updating columns")
      setDragColumns(columns);
    }
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
    activationConstraint: {
      distance: {x: 15}, // px before drag starts
      },
    })
  );

  const getColPos = useCallback((id: number) =>
    dragColumns.findIndex(col => col.id === id),
    [dragColumns]
  );

  function colOrderUpdate(cols:Column[]){

    cols.forEach((col, index) => {
      const colData:ColumnCreate = {
        ...col,
        position: index // or whatever position field you use
      };
   
      updateCol(col.id, colData);
    });

  }
  function leftButtonHandler(colId:number){
    console.log("left button pressed",colId-1)
    const originalPos = getColPos(colId);
    if (originalPos!==dragColumns.length-1) {
      setDragColumns((dragcols) => {
      const newArr = arrayMove(dragcols, originalPos, originalPos-1);
      colOrderUpdate(newArr);
      return newArr;
    });
    } 
  }
  function rightButtonHandler(colId:number){
    console.log("right button pressed",colId+1)
    const originalPos = getColPos(colId);
    if (originalPos!==dragColumns.length-1) {
      setDragColumns((dragcols) => {
      const newArr = arrayMove(dragcols, originalPos, originalPos+1);
      colOrderUpdate(newArr);
      return newArr;
    });
    } 
  }

  const handleDragEnd = useCallback((event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDragColumns((dragcols) => {
      const originalPos = getColPos(active.id);
      const newPos = getColPos(over.id);
      const newArr = arrayMove(dragcols, originalPos, newPos);
      
      console.log("new smth",newArr)
      colOrderUpdate(newArr);
      return newArr;
    });
  }, [getColPos]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load columns {error.message}</p>;
  if (!columns) return <p>Failed to load columns</p>;

  return (
    <DndContext modifiers={[restrictToHorizontalAxis]} collisionDetection={closestCorners} sensors={sensors} onDragEnd={handleDragEnd}>

      <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
        <div className="flex space-x-6 overflow-x-auto pb-4">
          <SortableContext items={dragColumns} strategy={horizontalListSortingStrategy}>
            {dragColumns.map((col) => (
            <KanbanColumn id={col.id} colLocalPosition={getColPos(col.id)} taskArray={projectTaskParser(col.id,projectTasks)} leftHandler={() => leftButtonHandler(col.id)}rightHandler={() => rightButtonHandler(col.id)} colArrayLength={dragColumns.length} column={col} key={col.id}/>
          ))}
          </SortableContext>
          
        </div> 
      </div>
    </DndContext>
     
  )
}

"use client"

import { useColumns } from "@/hooks/use-columns"
import { MoreHorizontal } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import KanbanColumn from "./kanban-column"
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable"
import { Column, ColumnCreate, Task } from "@/types"
import {DndContext,DragOverlay,PointerSensor,closestCorners, useSensor, useSensors} from "@dnd-kit/core"
import {
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers';
import { useProjectTasks } from "@/hooks/use-tasks"
import { TaskCard } from "@/components/task-card"
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
function groupTasksByColumnId(results: Task[]) {
   if (!results) return [];

  return results.reduce((acc, task) => {
    if (!acc[task.columnId]) {
      acc[task.columnId] = [];
    }
    acc[task.columnId].push(task);
    return acc;
  }, {} as Record<number, Task[]>);
}

function projectTaskParser(colId: number, projectTasks?:Record<number, Task[]>) {
  if (!projectTasks) return [];
  return projectTasks[colId] ?? [];
}
export function KanbanBoard({ projectId }: { projectId: string }) {
  const { columns, isLoading, error, updateCol } = useColumns(projectId);
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


  const [activeTask, setActiveTask] = useState<Task | null>(null);
  let { projectTasks } = useProjectTasks(projectId);
  projectTasks = projectTasks ?? [];
  
  const [rawTasksArray, setRawTasksArray] = useState<Task[]>([]);

  useEffect(() => {
    if (!projectTasks) return;

    const differentContent = JSON.stringify(rawTasksArray) !== JSON.stringify(projectTasks);

    if (differentContent) {
      console.log("Updating Global tasks")
      setRawTasksArray(projectTasks);
    }
  }, [projectTasks]); 
  const sortedProjectTasks = groupTasksByColumnId(rawTasksArray);

  const sensors = useSensors(
    useSensor(PointerSensor, {
    activationConstraint: {
      distance: {x:15, y:15}, // px before drag starts
      },
    })
  );

  const getColPos = useCallback((id: number) =>
    dragColumns.findIndex(col => col.id === id),
    [dragColumns]
  );
  const getTaskPos = useCallback((id: number) =>
    rawTasksArray.findIndex(task => task.id === id),
    [rawTasksArray]
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
    const originalPos = getColPos(colId);
    if (originalPos!==dragColumns.length-1) {
      setDragColumns((dragcols) => {
      const newArr = arrayMove(dragcols, originalPos, originalPos+1);
      colOrderUpdate(newArr);
      return newArr;
    });
    } 
  }

  const handleDragStart = useCallback((event: { active: any }) => {
    const type = event.active.data.current?.type;
    const id = event.active.id

    if (type === "task") {
      const task = event.active.data.current?.task;
      
      setActiveTask(task);
      console.log(`Task ${id} is active`)
    }
  }, []);

  const handleDragOver = useCallback((event: { active: any; over: any }) => {
    const { active, over } = event;
    const type = active.data.current?.type;
    const task = active.data.current?.task;

    
    if (over && type==="task" ) {
      const sourceColumn=active.data.current?.task.columnId
      let overColumn=over.data.current?.task.columnId
      console.log("Dragging:", active.id, "from",sourceColumn,"over:", over.id,"-",overColumn);
      if (sourceColumn !==overColumn){
        setRawTasksArray((prev) => {
          console.log(sourceColumn, "to",overColumn)

          return prev.map((t) =>
            t.id === active.id
              ? { ...t, columnId: overColumn, position: -1 } // update moved task
              : t
          );
    
        });
      }
      
    } else {
      console.log("Dragging:", active.id, "over: nothing");
    }
  }, []);

  const handleDragEnd = useCallback((event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    
    if(activeType==="column"){
      setDragColumns((dragcols) => {
        const originalPos = getColPos(active.id);
        const newPos = getColPos(over.id);
        const newArr = arrayMove(dragcols, originalPos, newPos);
        
        console.log("new smth",newArr)
        colOrderUpdate(newArr);
        return newArr;
      });
    }else if(activeType==="task"){
      console.log("task moved")
      setActiveTask(null)

    }/*else if (activeType==="Tasks" && overType==="Tasks" ){
      const activeCol=active.data.current?.task.columnId
      const originalPos = getTaskPos(activeCol,active.id)
      const newPos=getTaskPos(over.id,activeCol)

      setDragSortedTasks((dragSortedTasks) => {
        const newArr = arrayMove(dragSortedTasks[activeCol], originalPos, newPos);
        const newRecord={
          ...dragSortedTasks,
          [activeCol]:newArr
        }
        console.log("new smth",newArr)
        //colOrderUpdate(newArr);
        return newRecord;
      });

    }*/
    
  }, [getColPos]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load columns {error.message}</p>;
  if (!columns) return <p>Failed to load columns</p>;

  return (
    <DndContext collisionDetection={closestCorners} sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}>

      <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
        <div className="flex space-x-6 overflow-x-auto pb-4">
          <SortableContext items={dragColumns} strategy={horizontalListSortingStrategy}>
            {dragColumns.map((col) => (

            <KanbanColumn id={col.id} colLocalPosition={getColPos(col.id)} taskArray={projectTaskParser(col.id,sortedProjectTasks)} leftHandler={() => leftButtonHandler(col.id)}rightHandler={() => rightButtonHandler(col.id)} colArrayLength={dragColumns.length} column={col} key={col.id}/>

          ))}
          </SortableContext>
        </div> 
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 ">
            <p>Col:{activeTask.columnId} Pos:{activeTask.position}</p>
            <TaskCard id={activeTask.id} task={activeTask} isDragging={true}/>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
     
  )
}

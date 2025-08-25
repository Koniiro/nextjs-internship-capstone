"use client"

import { useColumns } from "@/hooks/use-columns"
import { MoreHorizontal } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import KanbanColumn from "./kanban-column"
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable"
import { Column, ColumnCreate, Task, TaskCreate } from "@/types"
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
  const activeTaskRef = useRef<Task | null>(null);
  const originColumn = useRef<number | null>(null);

  let { projectTasks, updateTask } = useProjectTasks(projectId);
  projectTasks = projectTasks ?? [];
  
  const [rawTasksArray, setRawTasksArray] = useState<Task[]>([]);
  const rawTasksRef = useRef<Task[]>([]);

  const setTasks = (updater: (prev: Task[]) => Task[]) => {
    setRawTasksArray(prev => {
      const updated = updater(prev);
      rawTasksRef.current = updated; // keep ref in sync
      return updated;
    });

    console.log("Set Tasks Called", rawTasksRef.current)
  };

  useEffect(() => {
    if (!projectTasks) return;

    const differentContent = JSON.stringify(rawTasksArray) !== JSON.stringify(projectTasks);

    if (differentContent) {
      console.log("Updating Global tasks")
      setTasks(()=>projectTasks);

    }
  }, [projectTasks]); 
  

  const sensors = useSensors(
    useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // px before drag starts
      },
    })
  );

  const getColPos = useCallback((id: number) =>
    dragColumns.findIndex(col => col.id === id),
    [dragColumns]
  );
  const getTaskPos = (id: number, filterArray: Task[]) =>
    filterArray.findIndex(task => task.id === id);

  function colOrderUpdate(cols:Column[]){

    cols.forEach((col, index) => {
      const colData:ColumnCreate = {
        ...col,
        position: index // or whatever position field you use
      };
   
      updateCol(col.id, colData);
    });

  }
  function taskUpdateHandler(newTaskArr:Task[]){
    newTaskArr.forEach((task, index) => {
      const taskData:TaskCreate = {
        ...task, 
      };
      //console.log("Updates task",index,taskData)
      updateTask(task.id, taskData);
  });
    
}
  function taskOrderUpdate(destinationColumn:number|null,originalColumn:number, taskArray:Task[]){

    if(destinationColumn===originalColumn){
      console.log("Update within column",originalColumn)
      const filteredTaskList=taskArray.filter(t=>t.columnId===originalColumn)
      taskUpdateHandler(filteredTaskList)
    }else{
      console.log("Update from column",originalColumn,'to',destinationColumn)
      const filteredTaskList1=taskArray.filter(t=>t.columnId===originalColumn)
      taskUpdateHandler(filteredTaskList1)

      const filteredTaskList2=taskArray.filter(t=>t.columnId===destinationColumn)
      taskUpdateHandler(filteredTaskList2)

    }

    /*tasks.forEach((task, index) => {
      const taskData:ColumnCreate = {
        ...task,
        position: index // or whatever position field you use
        columnI
      };
   
      updateCol(col.id, colData);
    });*/
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
      originColumn.current=task.columnId;
      activeTaskRef.current = task;
      console.log(`Task ${id} is active`)
    }
  }, []);

  const handleDragOver = useCallback((event: { active: any; over: any }) => {
    const { active, over } = event;

    const aType = active.data.current?.type;
    const oType = over.data.current?.type;

    
    if (over && aType==="task"  && oType==="task") {
      const sourceColumn=active.data.current?.task.columnId
      let overColumn=over.data.current?.task.columnId
      console.log("Dragging:", active.id, "from",sourceColumn,"over:", over.id,"-",overColumn);
      if (sourceColumn !==overColumn){

        setTasks((prev) =>
          prev.map((t) =>
            t.id === active.id ? { ...t,  columnId: overColumn, position: -1 } : t
          )
        );
      }
      
    } else {
      console.log("Dragging:", active.id, "over: nothing");
    }
  }, []);

  const handleDragEnd = useCallback((event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!active || !over) return;

    /*const task = activeTaskRef.current; // always fresh here
    
    if (task!=null){
      console.log("✅ Drag ended for task:", task);
    }*/
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;


    console.log("Drag End",activeType,overType)
    if(activeType==="column"){
      if (active.id === over.id ) return;

      setDragColumns((dragcols) => {
        const originalPos = getColPos(active.id);
        const newPos = getColPos(over.id);
        const newArr = arrayMove(dragcols, originalPos, newPos);
        
        colOrderUpdate(newArr);
        return newArr;
      });
    }else if(activeType==="task"){

      //Retrieve column the task is currently in

      const actTask:Task=active.data.current.task

      console.log("active id",active.id,"over id",over.id,"currentCol",actTask.columnId,"originCol",originColumn.current)
      
      //Check if placed on the same spot
      if (active.id === over.id && actTask.columnId===originColumn.current ) {
        console.log("Task dropped in the same area")
        activeTaskRef.current = null;
        setActiveTask(null) 
        originColumn.current=null;
        return
      }
      //Move in column
      
      if (originColumn.current===actTask.columnId){

        
        // Filter tasks into a holder array new array
        const filteredOriginTaskList = rawTasksRef.current
          .filter(t => t.columnId === originColumn.current).sort((a, b) => a.position - b.position)
          .map(t => ({ ...t }));

        //Retrieve Position
        const origPos=getTaskPos(active.id,filteredOriginTaskList)
        const newPos=getTaskPos(over.id,filteredOriginTaskList)
        console.log("Move in Column",filteredOriginTaskList)
        console.log("active id",active.id,origPos)
        console.log("over id",over.id,newPos)

        //Move within the array itself
        const refactoredOriginTaskArray = arrayMove(filteredOriginTaskList, origPos, newPos);

        //Update Position Values
        refactoredOriginTaskArray.forEach((task,index)=>{
          task.position=index;
        })

        console.log("Moved Array",refactoredOriginTaskArray)

        //Update local Array
        setTasks(prev =>{
          const updates = new Map(refactoredOriginTaskArray.map(t => [t.id, t.position]));

          return prev.map(task =>
            updates.has(task.id) ? { ...task, position: updates.get(task.id)! } : task
          );}
        );

        //Update Server
        taskUpdateHandler(refactoredOriginTaskArray)


      }else{

        // Origin Column
        const filteredOriginTaskList=rawTasksRef.current.filter(t=>t.columnId===originColumn.current)
        filteredOriginTaskList.forEach((task,index)=>{
          task.position=index;
        })

        console.log("Origin Array",filteredOriginTaskList)



        // New Column
        const filteredNewTaskList=rawTasksRef.current.filter(t=>t.columnId===actTask.columnId)
        const origPos=getTaskPos(active.id,filteredNewTaskList)
        const newPos=getTaskPos(over.id,filteredNewTaskList)
        
        const refactoredNewTaskArray = arrayMove(filteredNewTaskList, origPos, newPos);
        refactoredNewTaskArray.forEach((task,index)=>{
          task.position=index;
        })

        console.log("from",origPos,"to",newPos)
        console.log("Origin Array",filteredOriginTaskList)
        console.log("Target Array",refactoredNewTaskArray)

      }



  

     /* setTasks((prev) =>
          prev.map((t) =>
            t.id === active.id ? { ...t,  position: newPos } : t
          )
      );*/


      //taskOrderUpdate(originColumn.current,actTask.columnId)
      activeTaskRef.current = null;
      setActiveTask(null) 
      originColumn.current=null;
    
    }  
 

    
    
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
             
            <KanbanColumn id={col.id} colLocalPosition={getColPos(col.id)} taskArray={projectTaskParser(col.id,groupTasksByColumnId(rawTasksArray))} leftHandler={() => leftButtonHandler(col.id)}rightHandler={() => rightButtonHandler(col.id)} colArrayLength={dragColumns.length} column={col} key={col.id}/>

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

// sortablejs

// "use client";

// import React, { useState, useEffect } from "react";
// import {Sortable} from 'react-sortablejs'
// import axios from "axios";

// const KanbanBoard = () => {
//   const [tasks, setTasks] = useState({
//     todo: [],
//     inprogress: [],
//     completed: [],
//   });

//   useEffect(() => {
//     // Fetch tasks from the backend
//     async function fetchTasks() {
//       try {
//         const res = await axios.get("/api/tasks");
//         const data = res.data;

//         // Organize tasks based on their status
//         const organizedTasks = {
//           todo: data.filter((task) => task.status === "Todo"),
//           inprogress: data.filter((task) => task.status === "InProgress"),
//           completed: data.filter((task) => task.status === "Done"),
//         };
//         setTasks(organizedTasks);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       }
//     }

//     fetchTasks();
//   }, []);

//   // Function to handle the reordering of tasks within or across columns
//   const handleTaskReorder = (newOrder, column) => {
//     setTasks({
//       ...tasks,
//       [column]: newOrder.map((taskId) =>
//         tasks[column].find((task) => task._id === taskId)
//       ),
//     });
//   };

//   // Function to handle moving tasks between columns
//   const handleMoveTask = (taskId, sourceCol, destCol) => {
//     const movedTask = tasks[sourceCol].find((task) => task._id === taskId);

//     // Update tasks
//     setTasks({
//       ...tasks,
//       [sourceCol]: tasks[sourceCol].filter((task) => task._id !== taskId),
//       [destCol]: [...tasks[destCol], { ...movedTask, status: destCol }],
//     });

//     // Update task status in the backend
//     try {
//       axios.put(`/api/tasks`, {
//         id: movedTask._id,
//         updates: {
//           status: destCol === "todo" ? "Todo" : destCol === "inprogress" ? "InProgress" : "Done",
//         },
//       });
//     } catch (error) {
//       console.error("Failed to update task:", error);
//     }
//   };

//   // Render tasks within SortableJS components
//   const renderTasks = (column) => {
//     const taskList = tasks[column] || [];

//     return (
//       <Sortable
//         options={{
//           group: "tasks", // Allows dragging between columns
//           animation: 150,
//           onEnd: (evt) => {
//             const { oldIndex, newIndex } = evt;
//             if (oldIndex !== newIndex) {
//               const updatedTasks = [...taskList];
//               const [movedTask] = updatedTasks.splice(oldIndex, 1);
//               updatedTasks.splice(newIndex, 0, movedTask);
//               handleTaskReorder(updatedTasks.map((task) => task._id), column);
//             }
//           },
//         }}
//         tag="div"
//         className="task-list"
//       >
//         {taskList.map((task) => (
//           <div
//             key={task._id}
//             className="bg-white p-4 mb-2 rounded shadow"
//             draggable="true"
//             onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}
//             onDrop={(e) => handleMoveTask(e.dataTransfer.getData("taskId"), column, column)}
//           >
//             <p>{task.title}</p>
//           </div>
//         ))}
//       </Sortable>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold mb-4">TaskD.</h1>
//         <button className="border px-4 py-2">Log Out</button>
//       </div>

//       <div className="flex justify-center mb-4">
//         <a href="/task" className="px-4 py-2 border rounded-l-md">
//           Task
//         </a>
//         <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md">
//           Kanban
//         </button>
//       </div>

//       <div className="flex space-x-4">
//         {/* Todo Column */}
//         <div
//           className="w-1/3 p-4 border rounded-md"
//           onDrop={(e) => handleMoveTask(e.dataTransfer.getData("taskId"), "todo", "todo")}
//           onDragOver={(e) => e.preventDefault()}
//         >
//           <h2 className="text-lg font-bold mb-4">Todo</h2>
//           {renderTasks("todo")}
//         </div>

//         {/* In Progress Column */}
//         <div
//           className="w-1/3 p-4 border rounded-md"
//           onDrop={(e) => handleMoveTask(e.dataTransfer.getData("taskId"), "inprogress", "inprogress")}
//           onDragOver={(e) => e.preventDefault()}
//         >
//           <h2 className="text-lg font-bold mb-4">In Progress</h2>
//           {renderTasks("inprogress")}
//         </div>

//         {/* Completed Column */}
//         <div
//           className="w-1/3 p-4 border rounded-md"
//           onDrop={(e) => handleMoveTask(e.dataTransfer.getData("taskId"), "completed", "completed")}
//           onDragOver={(e) => e.preventDefault()}
//         >
//           <h2 className="text-lg font-bold mb-4">Completed</h2>
//           {renderTasks("completed")}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KanbanBoard;


//dnd-kit

// "use client";

// import React, { useState, useEffect } from "react";
// import { DndContext, Droppable, Draggable } from "@dnd-kit/core";
// import { arrayMove } from "@dnd-kit/sortable";
// import axios from "axios";

// const KanbanBoard = () => {
//   const [tasks, setTasks] = useState({
//     todo: [],
//     inprogress: [],
//     completed: [],
//   });

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await axios.get("/api/tasks");
//         const data = res.data;

//         const organizedTasks = {
//           todo: data.filter((task) => task.status === "Todo"),
//           inprogress: data.filter((task) => task.status === "InProgress"),
//           completed: data.filter((task) => task.status === "Done"),
//         };
//         setTasks(organizedTasks);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       }
//     };

//     fetchTasks();
//   }, []);

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     // Check if the item was dropped outside a droppable area
//     if (!over) return;

//     const activeColumn = active.data.current.sortable.containerId;
//     const overColumn = over.id;

//     if (activeColumn === overColumn) {
//       const newTasks = {
//         ...tasks,
//         [activeColumn]: arrayMove(tasks[activeColumn], active.index, over.index),
//       };
//       setTasks(newTasks);
//     } else {
//       const movedTask = tasks[activeColumn][active.index];
//       const newActiveTasks = tasks[activeColumn].filter((_, index) => index !== active.index);
//       const newOverTasks = [...tasks[overColumn], { ...movedTask, status: overColumn }];

//       const newTasks = {
//         ...tasks,
//         [activeColumn]: newActiveTasks,
//         [overColumn]: newOverTasks,
//       };
//       setTasks(newTasks);

//       // Update task status in the backend
//       axios.put(`/api/tasks`, {
//         id: movedTask._id,
//         updates: {
//           status: overColumn === "todo" ? "Todo" : overColumn === "inprogress" ? "InProgress" : "Done",
//         },
//       });
//     }
//   };

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       <div className="container mx-auto p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-3xl font-bold mb-4">TaskD.</h1>
//           <button className="border px-4 py-2">Log Out</button>
//         </div>

//         <div className="flex space-x-4">
//           {["todo", "inprogress", "completed"].map((column) => (
//             <Droppable key={column} id={column}>
//               {(provided) => (
//                 <div
//                   className="w-1/3 p-4 border rounded-md"
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   <h2 className="text-lg font-bold mb-4">{column.charAt(0).toUpperCase() + column.slice(1)}</h2>
//                   {tasks[column].map((task, index) => (
//                     <Draggable key={task._id} id={task._id} index={index}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className="bg-white p-4 mb-2 rounded shadow"
//                         >
//                           <p>{task.title}</p>
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </div>
//     </DndContext>
//   );
// };

// export default KanbanBoard;

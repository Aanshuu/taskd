// "use client";

// import React, { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
//         // console.log(data);

//         // Organize tasks based on their status
//         const organizedTasks = {
//           todo: data.filter((task) => task.status === "Todo"),
//           inprogress: data.filter((task) => task.status === "InProgress"),
//           completed: data.filter((task) => task.status === "Done"),
//         };
//         // console.log(organizedTasks);
//         setTasks(organizedTasks);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       }
//     }

//     fetchTasks();
//   }, []);

//   const handleDragEnd = async (result) => {
//     const { source, destination } = result;

//     if (!destination) return;

//     // If the source and destination are the same, do nothing
//     if (source.droppableId === destination.droppableId && source.index === destination.index) {
//       return;
//     }

//     const newTasks = { ...tasks }; // Make a deep copy of the tasks state
//     const sourceCol = Array.from(newTasks[source.droppableId]);
//     const destCol = Array.from(newTasks[destination.droppableId]);

//     const [movedTask] = sourceCol.splice(source.index, 1);
//     destCol.splice(destination.index, 0, movedTask);

//     // Update task state
//     setTasks({
//       ...newTasks,
//       [source.droppableId]: sourceCol,
//       [destination.droppableId]: destCol,
//     });

//     // Update task status in the backend
//     try {
//       await axios.put(`/api/tasks`, {
//         id: movedTask._id,
//         updates: {
//           status:
//             destination.droppableId === "todo"
//               ? "Todo"
//               : destination.droppableId === "inprogress"
//               ? "InProgress"
//               : "Done",
//         },
//       });
//     } catch (error) {
//       console.error("Failed to update task:", error);
//     }
//   };

//   // Helper function to render tasks based on status
//   // Rendering the Droppable components
//   const renderTasks = (status) => {
//     const taskList = tasks[status.toLowerCase()] || [];
//     return (
//       <Droppable droppableId={status.toLowerCase()}>
//         {(provided) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             {taskList.length > 0 ? (
//               taskList.map((task, index) => {
//                 // console.log("Task ID:", task , task._id);  // Add this line to check task IDs
//                 return (
//                   <Draggable key={task._id.toString()} draggableId={task._id.toString()} index={index}>
//                     {(provided) => (
//                       <div
//                         className="bg-white p-4 mb-2 rounded shadow"
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                       >
//                         <p>{task.title}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 );
//               })
//             ) : (
//               <p>No tasks available</p>
//             )}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     );
//   };

//   if (!tasks.todo.length && !tasks.inprogress.length && !tasks.completed.length) {
//     return <div>Loading...</div>;
//   }

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

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="flex space-x-4">
//           {/* Todo Column */}
//           <div className="w-1/3 p-4 border rounded-md">
//             <h2 className="text-lg font-bold mb-4">Todo</h2>
//             {renderTasks("todo")}
//           </div>

//           {/* In Progress Column */}
//           <div className="w-1/3 p-4 border rounded-md">
//             <h2 className="text-lg font-bold mb-4">In Progress</h2>
//             {renderTasks("inprogress")}
//           </div>

//           {/* Completed Column */}
//           <div className="w-1/3 p-4 border rounded-md">
//             <h2 className="text-lg font-bold mb-4">Completed</h2>
//             {renderTasks("completed")}
//           </div>
//         </div>
//       </DragDropContext>
//     </div>
//   );
// };

// export default KanbanBoard;

// import React from "react";
// import KanbanBoard from '@/components/KanbanBoard'

// const KanbanPage = () => {
//   return (
//     <div>
//       <KanbanBoard />
//     </div>
//   );
// };

// export default KanbanPage;


"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inprogress: [],
    completed: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        const data = res.data;

        const organizedTasks = {
          todo: data.filter((task) => task.status === "Todo"),
          inprogress: data.filter((task) => task.status === "InProgress"),
          completed: data.filter((task) => task.status === "Done"),
        };
        setTasks(organizedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Handle drag start event
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task._id);
    e.dataTransfer.setData("sourceColumn", task.status.toLowerCase()); // Ensure the status is in lowercase
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop event
  const handleDrop = (e, targetColumn) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn").toLowerCase(); // Match the format used in tasks state

    console.log("Dropped from:", sourceColumn, "to:", targetColumn);

    // Ensure sourceColumn is valid before proceeding
    if (!tasks[sourceColumn]) {
      console.error(`Invalid source column: ${sourceColumn}`);
      return;
    }

    // Find the dragged task
    const movedTask = tasks[sourceColumn].find((task) => task._id === taskId);
    if (!movedTask) {
      console.error(`Task with ID ${taskId} not found in ${sourceColumn}`);
      return;
    }

    // Update tasks state
    setTasks((prevTasks) => {
      const updatedSourceColumn = prevTasks[sourceColumn].filter(
        (task) => task._id !== taskId
      );
      const updatedTargetColumn = [
        ...prevTasks[targetColumn],
        { ...movedTask, status: targetColumn },
      ];

      return {
        ...prevTasks,
        [sourceColumn]: updatedSourceColumn,
        [targetColumn]: updatedTargetColumn,
      };
    });

    // Update task status in the backend
    axios.put(`/api/tasks`, {
      id: movedTask._id,
      updates: {
        status:
          targetColumn === "todo"
            ? "Todo"
            : targetColumn === "inprogress"
            ? "InProgress"
            : "Done",
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">TaskD.</h1>
        <button className="border px-4 py-2">Log Out</button>
      </div>

      <div className="flex justify-center mb-4">
        <a href="/task" className="px-4 py-2 border rounded-l-md">
          Task
        </a>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md">
          Kanban
        </button>
      </div>

      <div className="flex space-x-4">
        {/* Todo Column */}
        <div
          className="w-1/3 p-4 border rounded-md"
          onDrop={(e) => handleDrop(e, "todo")}
          onDragOver={handleDragOver}
        >
          <h2 className="text-lg font-bold mb-4">Todo</h2>
          {tasks.todo.map((task) => (
            <div
              key={task._id}
              className="bg-[#FF9A98] p-4 mb-2 rounded shadow"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <p>{task.title}</p>
            </div>
          ))}
        </div>

        {/* In Progress Column */}
        <div
          className="w-1/3 p-4 border rounded-md"
          onDrop={(e) => handleDrop(e, "inprogress")}
          onDragOver={handleDragOver}
        >
          <h2 className="text-lg font-bold mb-4">In Progress</h2>
          {tasks.inprogress.map((task) => (
            <div
              key={task._id}
              className="bg-[#FFEE8C] p-4 mb-2 rounded shadow"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <p>{task.title}</p>
            </div>
          ))}
        </div>

        {/* Completed Column */}
        <div
          className="w-1/3 p-4 border rounded-md"
          onDrop={(e) => handleDrop(e, "completed")}
          onDragOver={handleDragOver}
        >
          <h2 className="text-lg font-bold mb-4">Completed</h2>
          {tasks.completed.map((task) => (
            <div
              key={task._id}
              className="bg-[#89F336] p-4 mb-2 rounded shadow"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <p>{task.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

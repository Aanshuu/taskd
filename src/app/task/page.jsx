"use client";

import { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function TaskPage() {
  // State to hold task data

  const { data: session, status } = useSession();

  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "",
    dueDate: "",
  });
  const [sortOption, setSortOption] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Fetch tasks from the API on page load
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, [session]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle task creation
  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();

    if (currentTaskId) {
      // If a task is being edited
      await handleUpdate(currentTaskId, taskData);
      setCurrentTaskId(null); // Clear the current task ID
    } else {
      // Creating a new task
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }
    }

    // Reset task data after creating or updating
    setTaskData({
      title: "",
      description: "",
      status: "Todo",
      priority: "",
      dueDate: "",
    });
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === id ? updatedTask : task))
        );
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handle edit mode for tasks
  const handleEditTask = (task) => {
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setCurrentTaskId(task._id); // Store task ID for updating
  };

  const handleSort = (option) => {
    let sortedTasks = [...tasks];
    if (option === "priority") {
      sortedTasks.sort((a, b) => {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } else if (option === "dueDate") {
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    setTasks(sortedTasks);
    setSortOption(option); // Set the current sorting option
  };

  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading indicator while checking the session
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-6">
          Please sign in to access tasks
        </h2>
        <a
          className="px-6 py-2 bg-blue-500 text-white rounded"
          href="/signIn"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">TaskD.</h1>
        </div>
        <div>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <a
          href="/task"
          className="px-4 py-2 bg-blue-500 text-white rounded-l-md"
        >
          Task
        </a>
        <a href="/kanban" className="px-4 py-2 border rounded-r-md">
          Kanban
        </a>
      </div>

      <div className="flex">
        {/* Task creation form */}
        <form
          onSubmit={handleCreateOrUpdateTask}
          className="w-1/3 p-4 border rounded-md mr-4"
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="w-full p-2 border-2 rounded"
              type="text"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <input
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full p-2 border-2 rounded"
              type="text"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Status</label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="w-full p-2 border-2 rounded"
              required
            >
              <option value="Todo">Todo</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Priority</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="w-full p-2 border-2 rounded "
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Due Date</label>
            <input
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              type="date"
            />
          </div>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            type="submit"
          >
            {currentTaskId ? "Update Task" : "Create Task"}
          </button>
        </form>

        {/* Task list */}
        <div className="w-2/3 p-4 border rounded-md">
          {/* Sorting Options */}
          <div className="flex justify-end space-x-4 mb-4">
            <button
              onClick={() => handleSort("priority")}
              className={`px-4 py-2 border rounded ${
                sortOption === "priority" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Sort by Priority
            </button>
            <button
              onClick={() => handleSort("dueDate")}
              className={`px-4 py-2 border rounded ${
                sortOption === "dueDate" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Sort by Due Date
            </button>
          </div>
          {tasks.map((task, index) => (
            <div
              key={task._id}
              className="flex justify-between items-center mb-2 p-2 border rounded-md"
            >
              <div className="flex flex-col p-4 border-2 rounded-lg shadow-lg space-y-3 bg-white mr-4">
                {/* Priority Badge */}
                <div
                  className={`text-sm font-semibold px-3 py-1 rounded-full w-fit text-black ${
                    task.priority === "High"
                      ? "bg-[#FF9A98]"
                      : task.priority === "Medium"
                      ? "bg-[#FFEE8C]"
                      : "bg-[#89F336]"
                  }`}
                >
                  {task.priority}
                </div>

                {/* Task Title */}
                <h1 className="text-xl font-bold text-gray-800">
                  {task.title}
                </h1>

                {/* Task Description */}
                <p className="text-gray-600">
                  {task.description || "No description available"}
                </p>

                {/* Due Date */}
                <div className="text-sm text-gray-500">
                  Due Date:{" "}
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="flex justify-center items-center gap-4">
                <button onClick={() => handleEditTask(task)}>
                  <Pencil />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

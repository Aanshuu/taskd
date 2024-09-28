"use client";

import { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";

export default function TaskPage() {
  // State to hold task data
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "",
    dueDate: "",
  });

  // Fetch tasks from the API on page load
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (response.ok) {
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskData({
        title: "",
        description: "",
        status: "Todo",
        priority: "",
        dueDate: "",
      });
    }
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">TaskD.</h1>
        </div>
        <div>
          <button className="border px-4 py-2">Sign Up</button>
          <button className="border px-4 py-2">Sign In</button>
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
          onSubmit={handleCreateTask}
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
            Create
          </button>
        </form>

        {/* Task list */}
        <div className="w-2/3 p-4 border rounded-md">
          {tasks.map((task, index) => (
            <div
              key={task._id}
              className="flex justify-between items-center mb-2 p-2 border rounded-md"
            >
              <p>
                {index + 1}: {task.title}
              </p>
              <div className="flex justify-center items-center gap-4">
                <button>
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

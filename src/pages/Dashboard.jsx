import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, addTask, deleteTask as removeTask, updateTask } from "../redux/taskSlice";
import { clearToken } from "../redux/authSlice";
import api from "../api";

function Dashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");

  const fetchTasks = async () => {
    const res = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setTasks(res.data));
  };

  const handleAdd = async () => {
    if (!newTask) return;
    const res = await api.post("/tasks", { title: newTask }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(addTask(res.data));
    setNewTask("");
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(removeTask(id));
  };

  const handleToggleComplete = async (task) => {
    const updated = { ...task, completed: !task.completed };
    const res = await api.put(`/tasks/${task._id}`, updated, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(updateTask(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => dispatch(clearToken())}>Logout</button>

      <div>
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New Task" />
        <button onClick={handleAdd}>Add Task</button>
      </div>

      <div>
        <input
          placeholder="Filter tasks"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id}>
            <span
              onClick={() => handleToggleComplete(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

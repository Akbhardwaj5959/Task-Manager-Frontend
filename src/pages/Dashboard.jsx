import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  deleteTask as removeTask,
  updateTask,
} from "../redux/taskSlice";
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
    if (!newTask.trim()) return;
    const res = await api.post(
      "/tasks",
      { title: newTask },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
  }, []);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">📋 Task Manager  </h2>
          <button className="btn btn-danger" onClick={() => dispatch(clearToken())}>
            Logout
          </button>
        </div>

        <div className="input-group mb-3">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New Task"
            className="form-control"
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Add Task
          </button>
        </div>

        <input
          className="form-control mb-3"
          placeholder="Filter tasks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <ul className="list-group">
          {filteredTasks.length === 0 ? (
            <li className="list-group-item text-muted text-center">No tasks found.</li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    id={`task-${task._id}`}
                  />
                  <label
                    className={`form-check-label ${
                      task.completed ? "text-decoration-line-through text-muted" : ""
                    }`}
                    htmlFor={`task-${task._id}`}
                  >
                    {task.title}
                  </label>
                </div>
                <div>
                  <span
                    className={`badge ${
                      task.completed ? "bg-success" : "bg-warning text-dark"
                    } me-2`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                    
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

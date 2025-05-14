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
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState(""); 



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
  
  const handleEdit = (task) => {
    setEditId(task._id);
    setEditValue(task.title);
  };

  const handleEditSave = async (task) => {
    const updated = { ...task, title: editValue };
    const res = await api.put(`/tasks/${task._id}`, updated, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(updateTask(res.data));
    setEditId(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditValue("");
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

      <>
        {filteredTasks.map((task) => (
          <li key={task._id} className="task-item">
            {editId === task._id ? (
              <>
                <input
                  className="form-control"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  style={{ maxWidth: 200 }}
                  autoFocus
                />
                <button className="btn btn-success btn-sm" onClick={() => handleEditSave(task)}>Update</button>
                <button className="btn btn-secondary btn-sm" onClick={handleEditCancel}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  className={`task-title${task.completed ? " completed" : ""}`}
                  title="Toggle Complete"
                >
                  {task.title}
                </span>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className={`btn btn-${task.completed ? "warning" : "success"} btn-sm`}
                  onClick={() => handleToggleComplete(task)}
                >
                  {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
        
         
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
      </>
    </div>
  );
}

export default Dashboard;

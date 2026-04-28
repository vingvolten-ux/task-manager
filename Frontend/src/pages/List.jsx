import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManaParticles from "../components/ManaParticles";
import API_URL from "../api";

function List() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    fetchTasks(token);
  }, []);

  const fetchTasks = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = async (id) => {
    const token = localStorage.getItem("token");
    const task = tasks.find((t) => t.id === id);
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: !task.completed }),
    });
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="app">
      <ManaParticles />
      <h1>My Tasks</h1>

      {tasks.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>No tasks yet. Add one!</p>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <div
            className={`task-item ${task.due_date && new Date(task.due_date) < new Date() && !task.completed ? "overdue" : ""}`}
            key={task.id}
          >
            <div className="task-left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <div>
                <div style={{ textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#aaa" : "white" }}>
                  {task.text}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  {task.category} {task.due_date ? `· Due ${task.due_date}` : ""}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to={`/detail/${task.id}`}>
                <button style={{ padding: "6px 12px", fontSize: "13px" }}>Edit</button>
              </Link>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ padding: "6px 12px", fontSize: "13px", background: "#ef4444" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
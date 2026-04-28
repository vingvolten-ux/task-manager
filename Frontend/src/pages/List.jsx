import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManaParticles from "../components/ManaParticles";
import API_URL from "../api";

function List() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchTasks(token);
  }, []);

  const fetchTasks = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = async (id) => {
    const token = localStorage.getItem("token");

    const task = tasks.find((t) => t.id === id);

    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app">
      <ManaParticles />
      <h1>Task List</h1>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task" key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                cursor: "pointer",
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>

            <div>
              {task.category} | {task.dueDate || "No date"}
            </div>

            <Link to={`/detail/${task.id}`}>
              <button>View</button>
            </Link>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/add")}>+ Add Task</button>
        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default List;
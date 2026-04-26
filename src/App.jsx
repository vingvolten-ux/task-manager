import { useState, useEffect } from "react";
import ManaParticles from "./components/ManaParticles";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("General");

  // Auto login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchTasks(token);
    }
  }, []);

  const fetchTasks = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          setIsLoggedIn(true);
          fetchTasks(data.token);
          setIsLoading(false);
        }, 800);
      } else {
        alert(data.error || "Login failed");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (text.trim() === "") return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, category, dueDate }),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks([...tasks, data]);
        setText("");
        setCategory("General");
        setDueDate("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    const token = localStorage.getItem("token");
    const task = tasks.find((t) => t.id === id);

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: editText,
          dueDate: editDate,
          category: editCategory,
        }),
      });

      setTasks(
        tasks.map((task) =>
          task.id === id
            ? { ...task, text: editText, dueDate: editDate, category: editCategory }
            : task
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Entering your workspace...</p>
        </div>
      ) : !isLoggedIn ? (
        <div className="login-container">
          <h1>Login</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <>
          <ManaParticles />

          <div className="app">
            <h1>Task Manager</h1>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
              }}
            >
              Logout
            </button>

            {/* Add Task */}
            <div className="task-input">
              <input
                type="text"
                placeholder="Enter a task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>General</option>
                <option>Work</option>
                <option>School</option>
                <option>Personal</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <button onClick={addTask}>Add</button>
            </div>

            {/* Task List */}
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task.id} className="task">
                  {editingId === task.id ? (
                    <>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />

                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      >
                        <option>General</option>
                        <option>Work</option>
                        <option>School</option>
                        <option>Personal</option>
                      </select>

                      <button onClick={() => saveEdit(task.id)}>Save</button>
                    </>
                  ) : (
                    <>
                      <span
                        onClick={() => toggleTask(task.id)}
                        style={{
                          textDecoration: task.completed ? "line-through" : "none",
                          cursor: "pointer",
                        }}
                      >
                        {task.text}
                      </span>

                      <div>
                        {task.category} | {task.dueDate || "No date"}
                      </div>

                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setEditText(task.text);
                          setEditDate(task.dueDate);
                          setEditCategory(task.category);
                        }}
                      >
                        Edit
                      </button>

                      <button onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
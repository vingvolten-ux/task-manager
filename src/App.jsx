import { useState} from "react";
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
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Active");


  const addTask = () => {
    if (text.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text,
      category,
      dueDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setText("");
    setCategory("General");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("TOKEN:", data.token);

      // save token
      localStorage.setItem("token", data.token);

      setIsLoggedIn(true);
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
  <>
    {isLoading ? (
      /* LOADING SCREEN */
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Entering your workspace...</p>
      </div>
    ) : !isLoggedIn ? (
      /* LOGIN PAGE */
      <div className="login-container">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br></br>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    ) : (
      /* MAIN APP */
      <>
        <ManaParticles />

        <div className="app">
          <h1>Task Manager</h1>

          <button onClick={() => setIsLoggedIn(false)}>Logout</button>

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

          <div className="filters">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>All</option>
              <option>General</option>
              <option>Work</option>
              <option>School</option>
              <option>Personal</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Completed</option>
              <option>Active</option>
            </select>
          </div>

          <div className="task-list">
            {[...tasks]
              .filter((task) => {
                const categoryMatch =
                  filterCategory === "All" ||
                  task.category === filterCategory;

                const statusMatch =
                  filterStatus === "All" ||
                  (filterStatus === "Completed" && task.completed) ||
                  (filterStatus === "Active" && !task.completed);

                return categoryMatch && statusMatch;
              })
              .sort((a, b) =>
                (a.dueDate || "").localeCompare(b.dueDate || "")
              )
              .map((task) => {
                const today = new Date().toISOString().split("T")[0];

                const isOverdue =
                  task.dueDate &&
                  task.dueDate < today &&
                  !task.completed;

                return (
                  <div className="task-item" key={task.id}>
                    <div className="task-left">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />

                      <div>
                        <span
                          style={{
                            textDecoration: task.completed
                              ? "line-through"
                              : "none",
                            color: isOverdue ? "#ef4444" : "white",
                          }}
                        >
                          {task.text}
                        </span>

                        <div
                          style={{
                            fontSize: "12px",
                            opacity: 0.7,
                            color: isOverdue ? "#ef4444" : "white",
                            textDecoration: task.completed
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {task.category} |{" "}
                          {task.dueDate || "No date"}
                        </div>
                      </div>
                    </div>

                    <button onClick={() => deleteTask(task.id)}>
                      ❌
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    )}
  </>
);
}

export default App;
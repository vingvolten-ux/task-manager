import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ManaParticles from "../components/ManaParticles";
import API_URL from "../api";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const found = data.find((t) => t.id == id);

      if (found) {
        setTask(found);
        setText(found.text);
        setCategory(found.category);
        setDueDate(found.dueDate || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveTask = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          category,
          dueDate,
        }),
      });

      if (res.ok) {
        navigate("/list");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <ManaParticles />
      <h1>Task Detail</h1>

      <div className="task-input">
        <input
          type="text"
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

        <p>Status: {task.completed ? "Completed" : "Active"}</p>

        <button onClick={saveTask}>Save Changes</button>

        <button onClick={() => navigate("/list")}>Back</button>
      </div>
    </div>
  );
}

export default Detail;

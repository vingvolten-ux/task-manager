import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");

  const addTask = async () => {
    if (text.trim() === "") {
      alert("Enter a task");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
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

      const data = await res.json();

      if (res.ok) {
        navigate("/list");
      } else {
        alert(data.error || "Failed to add task");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="app">
      <h1>Add New Task</h1>

      <div className="task-input">
        <input
          type="text"
          placeholder="Enter task..."
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

        <button onClick={addTask}>Save Task</button>

        <button onClick={() => navigate("/list")}>
          Back
        </button>
      </div>
    </div>
  );
}

export default AddItem;

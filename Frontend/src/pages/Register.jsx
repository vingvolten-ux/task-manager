import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ManaParticles from "../components/ManaParticles";
import API_URL from "../api";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created! Please log in.");
        navigate("/");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <ManaParticles />

      <div className="login-container">
        <h1>NIA</h1>
        <p>Create your account to get started.</p>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </>
  );
}

export default Register;
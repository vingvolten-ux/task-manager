import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ManaParticles from "../components/ManaParticles";
import API_URL from "../api";

function Home() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/list");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <ManaParticles />

      <div className="login-container">
        <h1>NIA</h1>
        <p>
          Welcome back to your Neural Intelligence Assistant! Please login to
          your account to gain access to the full suite of features.
        </p>

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

        <p style={{ marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </>
  );
}

export default Home;
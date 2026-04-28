import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!token) return null;

  return (
    <nav className="navbar">
      <span className="nav-logo">⚡ NIA</span>
      <div className="nav-links">
        <Link to="/list" className={location.pathname === "/list" ? "active" : ""}>Tasks</Link>
        <Link to="/add" className={location.pathname === "/add" ? "active" : ""}>+ Add</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
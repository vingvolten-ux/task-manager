import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <nav className="navbar">
      <div className="nav-logo">Task Manager</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/list">List</Link>
        <Link to="/add">Add Item</Link>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "List", path: "/list" },
    { name: "Add Item", path: "/add" },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">Task Manager</div>

      {/* Links */}
      <div className="nav-links">
        {links.map((link) => {
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={active ? "active" : ""}
            >
              {link.name}
            </Link>
          );
        })}

        {/* Logout */}
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
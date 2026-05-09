import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <h3>DocFlow</h3>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        {user ? (
          <>
            <Link to="/upload" style={linkStyle}>Upload</Link>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            <span style={{ marginLeft: "10px" }}>Hi, {user.name}</span>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  background: "#f0f0f0",
};

const linkStyle = {
  marginRight: "15px",
  textDecoration: "none",
  color: "#333",
};

const buttonStyle = {
  marginRight: "10px",
  padding: "6px 12px",
  cursor: "pointer",
};

export default Navbar;
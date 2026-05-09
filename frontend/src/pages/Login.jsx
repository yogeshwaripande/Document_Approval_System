/*import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../CSS/Login.module.css'; // Import CSS module

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:7620/Login", { email, password });

            if (data.token) {
                localStorage.setItem("token", data.token);

                if (data.role === "admin") navigate("/Admin/Admindashboard");
                else if (data.role === "user") navigate("/User/Userdashboard");
                else navigate("Viewer/Viewerdashboard");
            } else {
                alert("Invalid login credentials");
            }
        } catch (err) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles['side-box']}>
                <p className={styles.quote}><br />Let's get connected</p>
            </div>
            <div className={styles['login-box']}>
                <h2>Login</h2>
                <form onSubmit={handleLogin} id="loginForm">
                    <div className={styles['input-box']}>
                        <span className={styles.icon}>📧</span>
                        <input type="email" placeholder="Enter your email" onChange={(event) => setEmail(event.target.value)} required />
                    </div>
                    <div className={styles['input-box']}>
                        <span className={styles.icon}>🔒</span>
                        <input type="password" placeholder="Enter your password" onChange={(event) => setPassword(event.target.value)} required />
                    </div>
                    <Link to="/" className={styles['forgot-password']}>Forgot password?</Link>
                    <button type="submit">Login</button>
                </form>
                <p>Don’t have an account? <Link to="/Registration">Register</Link></p>
            </div>
        </div>
    );
}

export default Login;*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="input"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

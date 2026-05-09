/*import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../CSS/Registration.module.css';

export default function Register() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:7620/register', user);
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            alert("Error: " + (error.response?.data?.error || "Something went wrong"));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles['side-box']}>
                <p className={styles['quote']}>Let's get connected</p>
            </div>

            <div className={styles['register-box']}>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles['input-box']}>
                        <span className={styles.icon} aria-hidden="true">👤</span>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            placeholder="Enter your name"
                            onChange={handleChange}
                            required
                            aria-label="Your name"
                        />
                    </div>
                    <div className={styles['input-box']}>
                        <span className={styles.icon} aria-hidden="true">📧</span>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            required
                            aria-label="Email address"
                        />
                    </div>
                    <div className={styles['input-box']}>
                        <span className={styles.icon} aria-hidden="true">🔒</span>
                        <input type="password" name="password" value={user.password} placeholder="Enter your password" onChange={handleChange} required
                            aria-label="Password"
                        />
                    </div>
                    <div className={styles['input-box']}>
                        <span className={styles.icon} aria-hidden="true">👥</span>
                        <select
                            name="role"
                            onChange={handleChange}
                            value={user.role}
                            required
                            aria-label="Select your role"
                        >
                            <option value="" disabled>Select your role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
}
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "submitter", // default role
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("http://localhost:7620/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
        />
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
        <select name="role" value={form.role} onChange={handleChange} className="input">
          <option value="submitter">Submitter</option>
          <option value="approver">Approver</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
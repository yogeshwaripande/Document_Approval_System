import React, { useEffect, useState } from "react";
import API from "../api/api";

const AdminPanel = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      // Fixed API endpoint with backticks for template string interpolation
      await API.put(`/users/${userId}/role`, { role: newRole });

      // Optimistically update the role in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      // Refresh user list from the server (if needed)
      // fetchUsers(); // Optionally re-fetch after updating role
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="container">
      <h2>Admin Panel – User Management</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                >
                  <option value="submitter">Submitter</option>
                  <option value="approver">Approver</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

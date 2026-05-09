import React, { useEffect, useState } from "react";
import API from "../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userDocs, setUserDocs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name);
      fetchUserDocs(parsedUser.id); // Changed _id to id
    }
  }, []);

  const fetchUserDocs = async (userId) => {
    try {
      const res = await API.get("/documents");
      const userFiles = res.data.filter((doc) => doc.submittedBy?.id === userId); // Changed _id to id
      setUserDocs(userFiles);
    } catch (err) {
      console.error("Error fetching documents", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const body = { name };
      if (password) body.password = password;

      const res = await API.put("/users/me", body);

      // Update local storage
      const updatedUser = { ...user, name: res.data.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage("Profile updated!");
      setPassword("");
      setEditMode(false);
    } catch (err) {
      setMessage("Update failed.");
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>My Profile</h2>

      {!editMode ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Name: </label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>New Password (optional): </label>
            <input
              type="password"
              value={password}
              placeholder="Leave blank to keep old"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          {message && <p>{message}</p>}
        </form>
      )}

      <h3 style={{ marginTop: "2rem" }}>My Uploaded Documents</h3>
      {userDocs.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul>
          {userDocs.map((doc) => (
            <li key={doc.id}> {/* Changed from _id to id */}
              <a href={`http://localhost:5000/uploads/${doc.filename}`} // Fixed URL
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.filename}
              </a>
              -<em>{doc.status}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;

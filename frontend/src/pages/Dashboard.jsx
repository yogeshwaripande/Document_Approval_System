import React, { useEffect, useState } from "react";
import API from "../api/api";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, statusFilter]);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    setFilteredDocs(filtered);
  };

  const handleAction = async (docId, action) => {
    try {
      await API.put(`/documents/${docId}/status`, { status: action }); // Fixed API route
      fetchDocuments(); // Refresh the documents after the action
    } catch (err) {
      console.error("Failed to update document status", err);
    }
  };

  return (
    <div className="container">
      <h2>Documents</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by filename"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "6px", marginRight: "10px" }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Status</th>
            <th>Submitted By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocs.map((doc) => (
            <tr key={doc.id}> {/* Fixed key, use `doc.id` if `_id` is not available */}
              <td>
                <a
                  href={`http://localhost:5000/uploads/${doc.filename}`} // Fixed URL construction with template literals
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.filename}
                </a>
              </td>
              <td>{doc.status}</td>
              <td>{doc.submittedBy?.name || "N/A"}</td>
              <td>
                {user?.role === "approver" && doc.status === "pending" && (
                  <>
                    <button onClick={() => handleAction(doc.id, "approved")}>
                      Approve
                    </button>
                    <button onClick={() => handleAction(doc.id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
                {user?.role === "admin" && <span>(admin view)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

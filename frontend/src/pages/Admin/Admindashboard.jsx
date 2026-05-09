// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://localhost:7620/documents', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDocuments(response.data);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchDocuments();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <h3>Document Approval</h3>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>
                        {doc.title} - {doc.status}
                        {/* Add buttons for approval/rejection */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;

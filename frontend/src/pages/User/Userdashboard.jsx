// UserDashboard.js
import React, { useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [document, setDocument] = useState({
        title: '',
        content: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:7620/documents',
                document,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            alert("Document submitted successfully.");
        } catch (error) {
            alert("Error submitting document.");
        }
    };

    return (
        <div>
            <h2>User Dashboard</h2>
            <h3>Submit a Document</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={document.title}
                        onChange={(e) => setDocument({ ...document, title: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={document.content}
                        onChange={(e) => setDocument({ ...document, content: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Submit Document</button>
            </form>
        </div>
    );
};

export default UserDashboard;

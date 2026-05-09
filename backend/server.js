import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());  // Added security middleware

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((error) => {
    if (error) {
        console.log('Database connection failed:', error.stack);
        return;
    }
    console.log('Connected to the database');
});

// Register User
app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        db.query("SELECT * FROM Users WHERE email = ?", [email], async (error, result) => {
            if (result.length > 0) {
                return res.status(400).json({ error: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
            db.query(sql, [name, email, hashedPassword, role], (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "Database error", details: error });
                }
                res.status(201).json({ message: "User registered successfully", userID: result.insertId });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Login User
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    db.query("SELECT * FROM Users WHERE email = ?", [email], async (error, result) => {
        if (error || result.length === 0) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: user.role });
    });
});

// Middleware to check role
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = decoded;
        next();
    });
};


// Document Routes (CRUD)
app.post("/documents", verifyToken, (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    const sql = "INSERT INTO Documents (title, content, status, user_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, content, 'pending', userId], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Document submitted successfully", documentID: result.insertId });
    });
});

app.get("/documents", verifyToken, (req, res) => {
    const userId = req.user.id;
    const sql = req.user.role === 'admin'
        ? "SELECT * FROM Documents" 
        : "SELECT * FROM Documents WHERE user_id = ?";

    db.query(sql, [userId], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "Error fetching documents" });
        }
        res.json(result);  
    });
});

app.put("/documents/:id", verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Only admins can approve or reject documents" });
    }

    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE Documents SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "Error updating document status" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json({ message: `Document ${status} successfully` });
    });
});


// Protected Dashboard Route
app.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: `Welcome to ${req.user.role} dashboard`, role: req.user.role });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

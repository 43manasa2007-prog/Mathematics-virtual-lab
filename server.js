const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Connect to SQLite database
const db = new Database("mathematics_lab.db");

// Create users table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`).run();

// Allow JSON data
app.use(express.json());

// Session configuration
app.use(session({
    secret: "mathematics-virtual-lab-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

// Serve HTML, CSS and JS files
app.use(express.static(__dirname, { index: false }));

// Login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});
// Protected Mathematics Virtual Lab
app.get("/lab", (req, res) => {

    if (!req.session.userId) {
        return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "index.html"));
});

// Register a new user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Username and password are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.prepare(`
            INSERT INTO users (username, password)
            VALUES (?, ?)
        `).run(username, hashedPassword);

        res.json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Username already exists"
        });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = db.prepare(`
        SELECT * FROM users WHERE username = ?
    `).get(username);

    if (!user) {
        return res.json({
            success: false,
            message: "Invalid username or password"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.json({
            success: false,
            message: "Invalid username or password"
        });
    }

    // Save user information in session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
        success: true,
        message: "Login successful"
    });
});

// Check whether user is logged in
app.get("/check-login", (req, res) => {
    if (req.session.userId) {
        res.json({
            loggedIn: true,
            username: req.session.username
        });
    } else {
        res.json({
            loggedIn: false
        });
    }
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.json({
                success: false,
                message: "Logout failed"
            });
        }

        res.json({
            success: true,
            message: "Logged out successfully"
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Mathematics Virtual Lab running at http://localhost:${PORT}`);
});
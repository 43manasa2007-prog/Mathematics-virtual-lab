const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow JSON data
app.use(express.json());

// Serve HTML, CSS, JavaScript and other project files
app.use(express.static(__dirname, { index: false }));

// Open the Mathematics Virtual Lab directly
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mathematics Virtual Lab running at http://localhost:${PORT}`);
});
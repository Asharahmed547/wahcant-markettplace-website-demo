const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// ✅ IMPORTANT: absolute-safe paths
const PUBLIC_PATH = path.join(process.cwd(), "public");
const DATA_PATH = path.join(process.cwd(), "data");

// middleware
app.use(express.static(PUBLIC_PATH));
app.use(express.json());

// home route
app.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

// get products API
app.get("/api/products", (req, res) => {
    try {
        const data = fs.readFileSync(path.join(DATA_PATH, "products.json"), "utf-8");
        res.json(JSON.parse(data));
    } catch (err) {
        console.log(err);
        res.status(500).send("Products file not found");
    }
});

// 🚀 Start Server - Fixed for Docker
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Access the website at: http://localhost`);
    console.log(`🌐 Also accessible at: http://127.0.0.1`);
    console.log(`📦 Running inside Docker container on port 80`);
});
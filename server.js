const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// ✅ IMPORTANT: absolute-safe paths use karo
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

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
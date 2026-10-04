const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://db:27017/notes_db";

app.use(express.json());

// --- MongoDB model ---
const Note = mongoose.model(
  "Note",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      content: { type: String, default: "" },
    },
    { timestamps: true }
  )
);

// --- Routes ---
// GET /api/notes -> list all notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notes -> create a note
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const note = await Note.create({ title, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MongoDB connection + server start ---
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

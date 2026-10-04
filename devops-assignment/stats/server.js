const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

// Base URL of the notes API server.
// Locally: http://localhost:3000
// In Docker Compose: http://api:3000 (service name of the notes API)
const NOTES_API_URL = process.env.NOTES_API_URL || "http://api:3000";

app.get("/", async (req, res) => {
  try {
    const response = await fetch(`${NOTES_API_URL}/api/notes`);
    if (!response.ok) throw new Error(`Notes API returned ${response.status}`);

    const notes = await response.json();

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Notes count</title>
</head>
<body>
  <h1>Total notes: ${notes.length}</h1>
</body>
</html>`);
  } catch (err) {
    res.status(502).send(`<h1>Could not reach the notes API</h1><p>${err.message}</p>`);
  }
});

app.listen(PORT, () => console.log(`Count app running on port ${PORT}`));

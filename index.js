// Import Express module
const express = require('express');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Route to confirm backend is online
app.get('/', (req, res) => {
  res.send('Backend is online!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
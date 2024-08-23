require("dotenv").config(); // Load environment variables from a .env file into process.env
const express = require("express"); // Import the Express framework
const cors = require("cors"); // Import the CORS middleware to enable Cross-Origin Resource Sharing
const multer = require("multer"); // Import the Multer middleware for handling file uploads
const path = require("path"); // Import the 'path' module for handling and transforming file paths
const imageRoutes = require("./routes/imageRoutes"); // Import the image routes from the 'imageRoutes' file
const app = express(); // Create an Express application

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Multer configuration for file uploads (limit file size to 10MB)
const storage = multer.memoryStorage(); // Use memory storage for uploaded files
const upload = multer({
  storage, // Set the storage option
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Use the image routes and apply the Multer middleware to handle single file uploads
app.use("/api/v1/images", upload.single("file"), imageRoutes);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 5000; // Get the port from environment variables or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and log the port

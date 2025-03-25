const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./connection"); // Import DB connection
const taskRoutes = require("./routes/taskRoutes"); // Import API routes

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define API routes
app.use("/api/todo", taskRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Bad Request: Invalid Input";
    } else if (err.name === "CastError") {
        statusCode = 404;
        message = "Not Found: Resource does not exist";
    }

    res.status(statusCode).json({ error: message });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 API running on PORT ${PORT}`));

const express = require("express");
const app = express();
const PORT = 8000;
const mongoose = require("./connection");//to access database
const taskRoutes = require("./routes/taskRoutes");//to access task routes

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(taskRoutes);
app.use(express.json());
app.use("/api/todo", taskRoutes);

// Global Error Handling Middleware with HTTP Status Codes
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';
    
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Bad Request: Invalid Input';
    } else if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Not Found: Resource does not exist';
    }
    
    res.status(statusCode).json({
        error: message
    });
});

app.listen(8000, () => console.log(`API running on PORT ${PORT}`));
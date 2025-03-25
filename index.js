const express = require("express");
const app = express();
const PORT = 8000;
const mongoose = require("./connection");//connects to mongodb
const taskRoutes = require("./routes/taskRoutes");//import task related api routes

//middlewares
app.use(express.urlencoded({extended: true}));// extended: true allows parsing nested objects
app.use(express.json());//parses incoming application/json requests
app.use("/api/todo", taskRoutes);//Any request that matches /api/todo/* will be handled by taskRoutes

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
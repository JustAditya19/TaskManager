const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const Task = require("../models/Task");

const LOG_FILE = path.join(__dirname, "../logs/api_documentation.txt"); // Log file path

const logAPI = (req, res, next) => {
    const logEntry = `${req.method} ${req.url} ${res.statusCode}\n`;
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error("Error logging API:", err);
    });
    next(); // Ensure next() is called to avoid request hanging
};

// Add a new task (POST)
exports.addTask = async (req, res, next) => {
    try {
        //for validation
        if (!req.body.title || !req.body.description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const newTask = await Task.create({
            title: req.body.title,
            description: req.body.description
        });

        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
};


// Get a task by ID (GET)
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        logAPI(req, res, next);
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
};


//Get all tasks (GET)
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        logAPI(req, res, next);
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};


// Updating tasks by id (PUT)
require("mongoose");
require("../models/Task");
exports.updateTask = async (req, res, next) => {
    try {
        const { id } = req.params; //to access the id
        const { title, description } = req.body; //to access the schema

        console.log("🔍 Task ID Received:", id);
        console.log("📝 Update Fields:", { title, description });

        // Check if ID is a valid ObjectId(because sometimes postman takes it as a string)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid Task ID Format");
            return res.status(400).json({ message: "Invalid Task ID format" });
        }

        // Ensure at least one field is provided (in order to change or update the values)
        if (!title && !description) {
            console.log("⚠️ No fields provided for update");
            return res.status(400).json({ message: "Provide at least one field to update (title or description)" });
        }

        // Convert string ID to ObjectId
        const taskId = new mongoose.Types.ObjectId(id);

        // Find and update the task (Using $set, only the specified fields are updated without affecting other fields)
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: { ...(title && { title }), ...(description && { description }) } },
            { new: true, runValidators: true } // Return the updated document
        );

        // If no task is found (to tackle the error and print it)
        if (!updatedTask) {
            console.log("❌ Task Not Found in Database");
            return res.status(404).json({ message: "Task not found" });
        }

        console.log("✅ Task Updated Successfully:", updatedTask);
        res.status(200).json({
            message: "Task updated successfully",
            updatedTask
        });

    } catch (err) {
        console.error("❌ Error in updateTask:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


// Delete a task (DELETE)
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        logAPI(req, res, next);
        res.status(200).json({ message: "Task deleted" });
    } catch (err) {
        next(err);
    }
};

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

// Get all tasks

// Get a task by ID
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


exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        logAPI(req, res, next);
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

// Add a new task
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


// Delete a task
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

// Updating tasks by id (PUT)
require("mongoose");
require("../models/Task");
exports.updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        console.log("🔍 Task ID Received:", id);
        console.log("📝 Update Fields:", { title, description });

        // Check if ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid Task ID Format");
            return res.status(400).json({ message: "Invalid Task ID format" });
        }

        // Ensure at least one field is provided
        if (!title && !description) {
            console.log("⚠️ No fields provided for update");
            return res.status(400).json({ message: "Provide at least one field to update (title or description)" });
        }

        // Convert string ID to ObjectId
        const taskId = new mongoose.Types.ObjectId(id);

        // Find and update the task
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: { ...(title && { title }), ...(description && { description }) } },
            { new: true, runValidators: true } // Return the updated document
        );

        // If no task is found
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

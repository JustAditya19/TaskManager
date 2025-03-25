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
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        logAPI(req, res, next);
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

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

// Toggle task completion (PUT)
exports.toggleTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.completed = !task.completed;
        await task.save();

        logAPI(req, res, next);
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
};

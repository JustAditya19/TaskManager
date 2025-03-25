const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Routes for task operations
router.get("/", taskController.getTasks); // Get all tasks
router.post("/add", taskController.addTask); // Add a new task
router.put("/:id", taskController.updateTask); // Toggle task completion
router.delete("/:id", taskController.deleteTask); // Delete a task
router.get("/:id", taskController.getTaskById); // Get a task by its unique ID

module.exports = router;
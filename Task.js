const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: [3, "Title must be at least 3 characters"]},
    description: {type: String, required: true, maxlength: [500, "Title must be less than 500 characters"]},
    completed: {type: String, default: "pending"},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Task", taskSchema);
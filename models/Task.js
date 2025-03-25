const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: {type: String, required: true, minlength: [3, "Title must be at least 3 characters"]},
    description: {type: String, required: true, maxlength: [500, "Description must be less than 500 characters"]},
    completed: {type: String, default: "pending"},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Task", taskSchema);
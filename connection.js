const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1); // Stop server if DB connection fails
    }
};

module.exports = connectDB;

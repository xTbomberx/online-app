const mongoose = require('mongoose');



const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (e) {
        console.log("MONGO_DB connection error:", e);
    }
};

module.exports = connectDB;
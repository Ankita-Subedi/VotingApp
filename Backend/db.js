const mongoose = require('mongoose')

//Define the MongoDB connection URL
const mongoURL = process.env.MONGODB_URL_LOCAL

// Set up mongodb connection 
mongoose.connect(mongoURL);

// Get default connection 
const db = mongoose.connection;

// Define event listeners for database connection 
db.on('connected', ()=>{
    console.log("Connected to MongoDB server");
});

db.on('error', (err)=>{
    console.log("MongoDB connection error:", err);
});

db.on('disconnected', (err)=>{
    console.log("MongoDB disconnected");
});

module.exports = db;
const mongoose = require("mongoose");
// const MONGO_URI = "mongodb+srv://kksoccer78:4TKtHzbv1YXeYIoV@cluster0.ltvortn.mongodb.net/mernTinder";
const MONGO_URI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.7.0";

const connectDb = async()=>{
    await mongoose.connect(MONGO_URI)
} 

module.exports = connectDb;
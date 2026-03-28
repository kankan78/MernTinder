const mongoose = require("mongoose");
const MONGO_URI = "mongodb+srv://kksoccer78:4TKtHzbv1YXeYIoV@cluster0.ltvortn.mongodb.net/mernTinder";

const connectDb = async()=>{
    await mongoose.connect(MONGO_URI)
} 

module.exports = connectDb;
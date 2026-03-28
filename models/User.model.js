const { Schema, model } = require("mongoose");

const userScehema = new Schema({
    firstName: String,
    lastName: String,
    gender: String,
    age: Number,
    email: String,
    password: String
})

const UserModel = model("User",userScehema);

module.exports = UserModel;
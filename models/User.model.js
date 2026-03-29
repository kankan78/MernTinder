const { Schema, model } = require("mongoose");

const userScehema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15
    },
    lastName: {
        type: String,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

const UserModel = model("User",userScehema);

module.exports = UserModel;
const connectDb = require("../config/mongoDb")
const express = require("express");
const UserModel = require("../models/User.model");
const app = express();
const PORT = 7000;

app.use(express.json());

app.post("/signup",async (req,res)=>{
    userObj = req.body;
    // const userObj = {
    //     firstName:"kankan",
    //     lastName:"das",
    //     email:"kksoccer78@gmail.com",
    //     age:10,
    //     gender: "Male"
    // }
    const user = new UserModel(userObj);
    try{
        await user.save(userObj);
        res.send("Successfully Save");
    } catch(err) {
        console.log(err)
        res.status(500).send("Error in Saving to DB");
    }
})

connectDb().then(()=>{
    console.log("Database Connection established")
    app.listen(PORT, () => {
        console.log("Listening on Port: ", PORT);
    });
}).catch((err)=>{
    console.error("Error ! Database Connection",err)
})
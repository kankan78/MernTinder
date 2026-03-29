const connectDb = require("../config/mongoDb")
const express = require("express");
const UserModel = require("../models/User.model");
const app = express();
const PORT = 7000;

app.use(express.json());

/**Get All user */
app.get("/user",async (req,res)=>{
    try {
        const data = await UserModel.find({});
        if(data) {
            res.send(data);
        } else {
            res.send("No data found");
        }
    } catch(e) {
        res.status(500).send("Error ! While fetching ! Server issue")
    }
})

/**Get User dta by email */
app.post("/user",async (req,res)=>{
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({email:email});
        // console.log(user,email);
        
        if(user?.length ===0) {
            res.send("No data found for this Email " + email);
        } else{
            res.send(user);
        }
    } catch(e) {
        res.status(500).send("Error ! While fetching ! Server issue")
    }
})

/**Api to Delete user by Id */
app.delete("/user",async (req,res)=>{
    const { userId } = req.body;
    try{
        const result = await UserModel.findByIdAndDelete({_id:userId});
        if(result)res.send("Deleted user");
        else res.status(404).send("User not found");
    } catch(err) {
        res.status(500).send("Error in Deleting to DB");
    }
})

/**Api to Update a patch */
app.patch("/user",async (req,res)=>{
    const { userId,skills, ...data } = req.body;

    try{
        const NotAllowedUpdates =  ["email","firstname"];
        const noUpdateAllowed = Object.keys(data).some((key)=>{
           return NotAllowedUpdates.includes(key)
        });
    
        if(noUpdateAllowed){
            throw new Error("Update Not Allowed ! Not allowed to update email,firstname");
        }

        if(skills.length > 10){
            throw new Error("Update Not Allowed ! Skills limit 10");
        }

        const result = await UserModel.findByIdAndUpdate({_id:userId}, data, {returnDocument:"after"});
        if(result) res.send(result);
        else res.status(404).send("User not found");
    } catch(err) {
        res.status(500).send("Error in Updating to DB " + err.message);
    }
})

/**Api to SignUp */
app.post("/signup",async (req,res)=>{
    const userObj = req.body;
    const user = new UserModel(userObj);

    try{
        await user.save(userObj);
        res.send("Successfully Save");
    } catch(err) {
        console.log(err.message)
        res.status(500).send("Error in Saving to DB " + err.message);
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
const express = require("express");
const { UserRouteHandlers, adminAuth } = require("./middlewares/RouteHandlers");

const app = express();
const PORT = 7000;

const adminAuthMiddleWare = {};
const userRouteObj = new UserRouteHandlers();

app.use("/admin",adminAuth)

app.use("/users",
    userRouteObj.first,
    userRouteObj.second,
    userRouteObj.third
);

app.get("/getUserData", (req,res)=>{
    try {
        throw new Error("Some server error");
    }catch(err){
        res.status(500).send("Some server error")
    }
    res.send("all users data");
})

app.get("/admin/getAll",(req,res)=>{
    res.send("Data of all User")
});

app.post("/admin/delete/:name",(req,res)=>{
    const { name } = req.params;
    res.send("Delete data of "+ name);
});

app.use("/", (err,req,res,next)=>{
    if(err){
        res.status(500).send("Error! Sorry App Is On a Roller Coaster")
    }
})

app.listen(PORT, () => {
    console.log("Listening on Port: ", PORT);
});
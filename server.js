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

app.get("/admin/getAll",(req,res)=>{
    res.send("Data of all User")
});

app.post("/admin/delete/:name",(req,res)=>{
    const { name } = req.params;
    res.send("Delete data of "+ name);
});

app.listen(PORT, () => {
    console.log("Listening on Port: ", PORT);
});
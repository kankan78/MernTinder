const express = require("express");
require("./config/mongoDb");
const { Server } = require("socket.io");

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

const server = app.listen(PORT, () => {
    console.log("Listening on Port: ", PORT);
});

const io = new Server(server, {
    cors: {
      origin: "*",
    },
});

let documentContent = "";

io.on("connection", (socket)=>{
    console.log("User connected:", socket.id);

    // Send current document
    socket.emit("load-document", documentContent);

    // Receive changes
    socket.on("save-changes", (data) => {
        console.log(data)
        documentContent = data;
        socket.broadcast.emit("receive-changes", data);
    });

    // close socket
    socket.on("disconnect", () => {
        console.log("Disconnected socket", socket.id)
    })
});


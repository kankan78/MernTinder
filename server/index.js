const connectDb = require("../config/mongoDb")
const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const PORT = 7000;

const UserModel = require("../models/User.model");
const validateUserData = require("../utils/validations");
const authMiddleware = require("../middlewares/auth");
const authRouter = require("../routes/auth");
const connectionsRouter = require("../routes/connections");
const profileRouter = require("../routes/profile");
const userRouter = require("../routes/users");

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
)
// app.use(authMiddleware)

app.use("/request",connectionsRouter);
app.use("/profile",profileRouter);
app.use("/",authRouter);
app.use("/",userRouter);

/**Get All user */
app.get("/user/all", authMiddleware,async (req,res)=>{
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

app.get("/health",(req,res)=>{
    res.send("Server is running")
})

app.get("/",(req,res)=>{
    res.send("Path not found")
})

connectDb().then(()=>{
    console.log("Database Connection established")
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
        // console.log(socket);
        console.log("User connected:", socket.id);

        // Send current document
        socket.emit("load-document", documentContent);

        // Receive changes
        socket.on("save-changes", (data) => {
            documentContent = data;
            socket.broadcast.emit("receive-changes", data);
        });

        // close socket
        socket.on("disconnect", () => {
            console.log("Disconnected socket", socket.id)
        })
    });
}).catch((err)=>{
    console.error("Error ! Database Connection",err)
})
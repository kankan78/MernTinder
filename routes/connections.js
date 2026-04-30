const authMiddleware = require("../middlewares/auth");
const ConnectionModel = require("../models/Connections.model");

const connectionsRouter = require("express").Router();

connectionsRouter.post("/request/send/:status/:toUserId", authMiddleware, async (req,res)=>{
    try {
        const { toUserId, status } = req.params;
        const fromUserId = req.user._id;

        const connection = await ConnectionModel({
            fromUserId,
            toUserId,
            status
        }).save();

        res.status(200).send("Connection Success "+connection)
        
    } catch (error) {
        res.status(500).send("Error: " + error.message)
    }
})

module.exports = connectionsRouter;
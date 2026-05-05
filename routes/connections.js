const authMiddleware = require("../middlewares/auth");
const ConnectionModel = require("../models/Connections.model");
const UserModel = require("../models/User.model");

const connectionsRouter = require("express").Router();

connectionsRouter.post("/send/:status/:toUserId", authMiddleware, async (req, res) => {
    try {
        const { toUserId, status } = req.params;
        const fromUserId = req.user._id;

        const validStatusTypes = ["interested", "ignore"];

        if (!validStatusTypes.includes(status)) {
            throw new Error("Invalid Status type !!")
        }

        // Check if the `toUserId` and `fromUserId` are the same
        // if (fromUserId.equals(toUserId)) {
        //     throw new Error("Cannot connect to yourself!");
        // }

        // Check User model for existing Id
        const toUserPresent = await UserModel.findById(toUserId);
        if(!toUserPresent){
            throw new Error("Request to Invalid User !!")
        }

        const checkExistingConnectionRequest = await ConnectionModel.findOne({
            $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }]
            // fromUserId,toUserId
        })

        if (checkExistingConnectionRequest) {
            throw new Error("Duplicate Connection Request !!")
        }

        const connection = await ConnectionModel({
            fromUserId,
            toUserId,
            status
        }).save();

        res.status(200).send({
            message: "Connection Success ", data: connection
        })

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

connectionsRouter.post("/receive/:status/:requestId", authMiddleware, async (req, res) => {
    let {status, requestId} = req.params;
    let loggedInUser = req.user;

    try{
        if(!loggedInUser) throw new Error("No logged In user");

        const allowedStatusValues = ["accepted", "rejected"];

        if(!allowedStatusValues.includes(status)) throw new Error("Invalid received status type");

        const connectionObj = await ConnectionModel.findOne({
            "toUserId":loggedInUser.id,
            status: "interested",
            _id: requestId
        });

        if(!connectionObj){
            throw new Error("No such request Connections Found");
        } 

        connectionObj.status = status;
        const connection = await connectionObj.save();

        res.status(200).send({
            message: "Connection Success as " + status, data: connection
        })
    }catch(error){
        res.status(400).send("Error: " + error.message);
    }
})


module.exports = connectionsRouter;
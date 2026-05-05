const authMiddleware = require("../middlewares/auth");
const ConnectionModel = require("../models/Connections.model");
const UserModel = require("../models/User.model");

const userRouter = require("express").Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "skills"];

// Get all the pending connections details for current loggedIn user
userRouter.get("/requests/received", authMiddleware, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.status(200).json({
            message: "Fetched Successfully",
            connections: connections?.map((item) => item.fromUserId) || []
        })

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

// Get all connections of the loggedIn user
userRouter.get("/connections", authMiddleware, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionModel.find({
            $or: [{
                fromUserId: loggedInUser._id,
                status: "interested"
            }, {
                toUserId: loggedInUser._id,
                status: "interested"
            }]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const filteredData = connections?.map((item) => {
            if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return item.toUserId
            }
            return item.fromUserId
        });

        res.status(200).json({
            message: "Fetched Successfully",
            connections: filteredData || []
        })

    } catch (error) {

    }
})

userRouter.get("/feed", authMiddleware, async (req, res) => {
    try{
        //0. User must not see his card
        //1. User must not see the ones which he already interested or ignored
        //2. User already connected

        const loggedInUser = req.user;

        // Find all users that the loggedInUser does NOT have a connection (of any status) with,
        // and exclude the loggedInUser themself from the result.
        // Step 1: Get all user IDs connected to loggedInUser
        const existingConnectionDocs = await ConnectionModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select(['fromUserId', 'toUserId']);

        // Gather all connected user IDs
        const connectedUserIds = new Set();
        existingConnectionDocs.forEach(doc => {
            if (doc.fromUserId.toString() !== loggedInUser._id.toString()) {
                connectedUserIds.add(doc.fromUserId.toString());
            }
            if (doc.toUserId.toString() !== loggedInUser._id.toString()) {
                connectedUserIds.add(doc.toUserId.toString());
            }
        });

        // Add self to the exclude list
        connectedUserIds.add(loggedInUser._id.toString());

        // Find all users not in any connection with the logged in user and not self
        const feedUsers = await UserModel.find({
            _id: { $nin: Array.from(connectedUserIds) }
        }).select(USER_SAFE_DATA);

        // const connections = await ConnectionModel.find({
        //     $or : [{toUserId: loggedInUser._id},{fromUserId: loggedInUser._id}]
        // }).select(["fromUserId","toUserId"])
        // .populate("fromUserId","firstName").populate("toUserId","firstName");

        res.status(200).json({
            message:"Fetched Successfully",
            feedUsers
        })

    } catch (error){
        res.status(404).json({message:"Error: "+ error.message})
    }
})

module.exports = userRouter;
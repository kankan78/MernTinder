const authMiddleware = require("../middlewares/auth");
const UserModel = require("../models/User.model");
const { validateProfileData } = require("../utils/validations");
const router = require("express").Router();

/**Get User data by email */
router.get("/view", authMiddleware, async (req, res) => {
    // const { id,email } = req.body;

    try {
        const { user } = req;
        // const user = await UserModel.findOne({_id:id});
        // console.log(user,email);

        // if(user?.length ===0) {
        // res.send("No data found for this Email " + email);
        // } else{
        // res.send(user);
        // }
        res.send(user);
    } catch (e) {
        res.status(500).send("Error ! While fetching ! Server issue")
    }
})


/**Api to Update a patch */
router.patch("/edit", authMiddleware, async (req, res) => {
    // const { userId, skills } = req.body;
    const fields = req.body;
    const loggedInUser = req.user;

    try {
        if(!loggedInUser) throw new Error("User not defined")
        validateProfileData(req);

        // const result = await UserModel.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        // if (result) res.send(result);
        // else res.status(404).send("User not found");

        for (let key in fields) {
            loggedInUser[key] = fields[key];
        }

        await loggedInUser.save();

        res.json({ message: "User saved successFully", data: loggedInUser })
    } catch (err) {
        res.status(500).send("Error in Updating to DB! " + err.message);
    }
})


/**Api to Delete user by Id */
router.delete("/delete", authMiddleware , async (req, res) => {
    const loggedInUser = req.user;
    try {
        if(!loggedInUser) throw new Error("User not defined")

        loggedInUser.delete();
        // const result = await UserModel.findByIdAndDelete({ _id: userId });
        // if (result) res.send("Deleted user");
        // else res.status(404).send("User not found");
    } catch (err) {
        res.status(500).send("Error in Deleting to DB");
    }
})

module.exports = router;
const authMiddleware = require("../middlewares/auth");
const UserModel = require("../models/User.model");
const router = require("express").Router();

/**Get User data by email */
router.post("/user", authMiddleware, async (req, res) => {
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
router.patch("/edit", async (req, res) => {
    const { userId, skills } = req.body;
    const data = req.body;

    try {
        const NotAllowedUpdates = ["email", "firstname"];
        const noUpdateAllowed = Object.keys(req.body).some((key) => {
            return NotAllowedUpdates.includes(key)
        });

        if (noUpdateAllowed) {
            throw new Error("Update Not Allowed ! Not allowed to update email,firstname");
        }

        if (skills?.length > 10) {
            throw new Error("Update Not Allowed ! Skills limit 10");
        }

        const result = await UserModel.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
        if (result) res.send(result);
        else res.status(404).send("User not found");
    } catch (err) {
        res.status(500).send("Error in Updating to DB " + err.message);
    }
})


/**Api to Delete user by Id */
router.delete("/user", async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await UserModel.findByIdAndDelete({ _id: userId });
        if (result) res.send("Deleted user");
        else res.status(404).send("User not found");
    } catch (err) {
        res.status(500).send("Error in Deleting to DB");
    }
})

module.exports = router;
const UserModel = require("../models/User.model");

const getUserService = async function(req,res){
    const { email } = req.body;
    const user = await UserModel.findOne({email:email});
    return user;
}
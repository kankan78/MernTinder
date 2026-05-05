const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");

const SECRET_KEY = "DEV@Tinder$790";

const authMiddleware = async(req, res, next) => {
  
  try {
    // const token = req.header("Authorization")?.split(" ")[1];
    const { token } = req.cookies;
    if (!token) {
      throw new Error("No token");
    }

    const decodedObj = jwt.verify(token, SECRET_KEY);
    const { _id } = decodedObj;

    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch {
    res.status(400).json({ Error: "Invalid token ! User not Logged In" });
  }
};

module.exports = authMiddleware;
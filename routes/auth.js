const authRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");
const { validateUserData } = require("../utils/validations");
const authMiddleware = require("../middlewares/auth");

const SECRET_KEY = "DEV@Tinder$790";

//Register
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    // Validations
    validateUserData(req);

    const userCheck = await UserModel.findOne({ emailId })
    if (userCheck) {
      throw new Error("User already present")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      password: hashPassword,
      emailId: emailId
    });

    const savedUser = await newUser.save();
    const token = await newUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.send({ message: "Successfully Registered User", data: savedUser });
  } catch (err) {
    res.status(500).send("Error in Saving to DB " + err.message);
  }
});

//Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Invalid Credentials , emailId , password missing")
    }

    const user = await UserModel.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials , No user found")
    }

    if (user && user.validatePassword(user.password)) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(200).send("Logged In Successfully")
    } else {
      res.status(404).send("Invalid Credentials , invalid password")
    }

  } catch (e) {
    res.status(500).send("Invalid Credentials" + e.message)
  }
});

//Login
authRouter.post("/logout", authMiddleware, async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(200).send("Logout Successfully!")
  } catch (error) {
    res.status(500).send("Invalid Credentials")
  }
});

// Refresh token, access token genrate
authRouter.post("/api/auth/refresh", (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json("No refresh token");

  try {
    const user = jwt.verify(token, SECRET_KEY);

    const newAccessToken = jwt.sign({ _id: user._id }, SECRET_KEY, {
      expiresIn: "5m"
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json("Expired refresh token");
  }
});

// logout
authRouter.post("/api/auth/logout", (req, res) => {
  const { token } = req.body;

  refreshTokens = refreshTokens.filter(t => t !== token);

  res.json("Logged out");
});

module.exports = authRouter;
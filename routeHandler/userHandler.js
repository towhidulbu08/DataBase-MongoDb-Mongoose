const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const userSchema = require("../schemas/usersSchema");
const User = mongoose.model("User", userSchema);

//SignUp

router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "SignUp was successful",
    });
  } catch (err) {
    res.status(500).json({
      message: "SignUp Failed",
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });

    if (user && user.length > 0) {
      // console.log(user);
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      // console.log("isValidPass", isValidPassword);
      if (isValidPassword) {
        //generate token
        // console.log("userName", user[0].username);
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        console.log("Token", token);
        res.status(200).json({
          access_token: token,
          message: "Login Successful",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication Failed",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      error: "Authentication Failed",
    });
  }
});

// GET all Users

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).populate("todos");
    res.status(200).json({
      data: users,
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was a server side error",
    });
  }
});
module.exports = router;

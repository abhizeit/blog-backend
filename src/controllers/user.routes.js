const express = require("express");
const app = express.Router();
const argon2 = require("argon2");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authmiddleware = require("../middlewares/auth.middleware");

app.post("/refresh", async (req, res) => {
  // redis.push(token)
  try {
    const { rToken } = req.body;
    const verification = jwt.verify(rToken, process.env.REFRESH_SECRET);
    const user = await User.findOne({ email: verification.email });
    const { email, name, password } = user;
    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
      expiresIn: "2 minutes",
    });
    res.send({ error: false, token, message: "new token generated" });
  } catch (e) {
    // redis.push(rToken)
    res.send({ error: true, message: e.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await argon2.hash(password);
    let user = await User.create({ name, email, password: hash });
    // const token = jwt.sign(
    //   { id: user._id, email, password: hash, name },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7 days",
    //   }
    // );
    // const rToken = jwt.sign(
    //   { id: user._id, email, password: hash, name },
    //   process.env.REFRESH_SECRET,
    //   {
    //     expiresIn: "28 days",
    //   }
    // );
    res.send({
      error: false,
      message: "user created successfully.",
      // name: user.name,
      // token,
      // rToken,
    });
  } catch (e) {
    res.send({ error: true, message: "user already exists." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const match = await argon2.verify(user.password, password);
    if (match) {
      const token = jwt.sign(
        { id: user._id, email, password: user.password, name: user.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "7 days",
        }
      );
      const rToken = jwt.sign(
        { id: user._id, email, password: user.password, name: user.name },
        process.env.REFRESH_SECRET,
        { expiresIn: "28 days" }
      );
      return res.send({
        error: false,
        message: "sign in successful",
        name: user.name,
        token,
        rToken,
      });
    } else {
      return res.send({ error: true, message: "Wrong Password!!" });
    }
  } catch (e) {
    res.send({ error: true, message: "Wrong Credential!!" });
  }
});

app.get("/userdetails/", authmiddleware, (req, res) => {
  res.send("this is user details");
});

module.exports = app;

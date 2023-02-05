const express = require("express");
const Blog = require("../models/blog.model");

const app = express.Router();

app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ likesCount: -1 })
      .populate({ path: "author", select: ["name", "_id", "email"] })
      .populate({
        path: "comments.commentAuthor",
        select: ["name", "email", "_id"],
      })
      .populate({
        path: "likes",
        select: ["name", "email", "_id"],
      });
    res.send({ blogs });
  } catch (e) {
    res.send({ error: true, message: e.messsage });
  }
});

module.exports = app;

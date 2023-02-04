const express = require("express");
const Blog = require("../models/blog.model");
const authmiddleware = require("../middlewares/auth.middleware");

const app = express.Router();
app.patch("/likeBlog", authmiddleware, async (req, res) => {
  try {
    const { blogId } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { likes: req.id },
      },
      { new: true }
    )
      .populate({ path: "author", select: ["name", "_id", "email"] })
      .populate({
        path: "comments.commentAuthor",
        select: ["name", "email", "_id"],
      })
      .populate({
        path: "likes",
        select: ["name", "email", "_id"],
      });
    res.send({
      error: false,
      data: updatedBlog,
      message: "Likes updated successfully.",
    });
  } catch (e) {
    res.send({ error: true, message: e.message });
  }
});
app.patch("/unlikeBlog", authmiddleware, async (req, res) => {
  try {
    const { blogId } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: req.id },
      },
      { new: true }
    )
      .populate({ path: "author", select: ["name", "_id", "email"] })
      .populate({
        path: "comments.commentAuthor",
        select: ["name", "email", "_id"],
      })
      .populate({
        path: "likes",
        select: ["name", "email", "_id"],
      });
    res.send({
      error: false,
      data: updatedBlog,
      message: "Likes updated successfully.",
    });
  } catch (e) {
    res.send({ error: true, message: e.message });
  }
});

module.exports = app;

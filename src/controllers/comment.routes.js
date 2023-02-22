const express = require("express");
const Blog = require("../models/blog.model");
const authmiddleware = require("../middlewares/auth.middleware");

const app = express.Router();

app.post("/", authmiddleware, async (req, res) => {
  const { blogId, comment: commentString } = req.body;
  try {
    const blogPost = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: {
          comments: {
            $each: [{ commentString, commentAuthor: req.id }],
            $position: 0,
          },
        },
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
      message: "commment posted sucessfully",
      blogPost,
    });
  } catch (e) {
    res.send({ error: true, message: e.message });
  }
});

app.patch("/", authmiddleware, async (req, res) => {
  const { blogId, commentId } = req.body;
  console.log(blogId, commentId);
  try {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { comments: { _id: commentId } },
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
    // blog.comments.id(commentId).remove();
    // blog.save();
    res.send({
      error: false,
      message: "comment deleted successfully.",
      blogPost: blog,
    });
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = app;

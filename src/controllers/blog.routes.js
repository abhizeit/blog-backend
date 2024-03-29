const express = require("express");
const authmiddleware = require("../middlewares/auth.middleware");
const Blog = require("../models/blog.model");

const app = express.Router();

app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ _id: -1 })
      .populate({ path: "author", select: ["name", "_id", "email"] })
      .populate({
        path: "comments.commentAuthor",
        select: ["name", "email", "_id"],
      })
      .populate({
        path: "likes",
        select: ["name", "email", "_id"],
      });
    res.send(blogs);
  } catch (e) {
    res.send({ error: true, message: e.messsage });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate({ path: "author", select: ["name", "_id", "email"] })
      .populate({
        path: "comments.commentAuthor",
        select: ["name", "email", "_id"],
      })
      .populate({
        path: "likes",
        select: ["name", "email", "_id"],
      });
    res.send({ error: false, blog });
  } catch (e) {
    res.send({ error: true, message: e.messsage });
  }
});
//include authmiddleware
app.post("/", authmiddleware, async (req, res) => {
  try {
    const { title, article, image } = req.body;
    const blog = await (
      await Blog.create({ author: req.id, title, article, image })
    ).populate("author");
    res.send({ error: false, message: "blog created successfully.", blog });
  } catch (e) {
    res.send({ error: true, message: e.message });
  }
});

app.delete("/:id", authmiddleware, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!req.id.equals(blog.author)) {
    return res.status(401).send({
      error: true,
      message: "You are not authorized to delete this blog",
    });
  }
  await Blog.findByIdAndDelete(req.params.id);
  res.send({ error: false, messsage: "blog deleted successfully" });
});

app.patch("/:id", authmiddleware, async (req, res) => {
  try {
    const { title, article } = req.body;
    const { id } = req.params;
    const post = await Blog.findById(id);

    if (!req.id.equals(post.author)) {
      return res.status(401).send({
        error: true,
        message: "Your are not authorised to delete this blog.",
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        article,
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
    res.send({ error: false, blog });
  } catch (e) {
    res.send({ error: true, message: e.message });
  }
});
module.exports = app;

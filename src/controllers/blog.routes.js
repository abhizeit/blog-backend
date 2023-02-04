const express = require("express");
const authmiddleware = require("../middlewares/auth.middleware");
const Blog = require("../models/blog.model");

const app = express.Router();

app.get("/", async (req, res) => {
  console.log(req.ip);
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
//include authmiddleware
app.post("/", authmiddleware, async (req, res) => {
  const { title, article } = req.body;
  console.log(title, article);
  try {
    const blog = await (
      await Blog.create({ author: req.id, title, article })
    ).populate("author");
    res.send({ error: false, message: "blog created successfully.", blog });
  } catch (e) {
    res.send({ error: true, message: "unknown error occured." });
  }
});

app.delete("/:id", authmiddleware, async (req, res) => {
  console.log("delete triggered");
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
  const { title, article } = req.body;
  const post = await Blog.findById(req.params.id);
  if (req.id !== post._id) {
    return res.status(401).send({ errro: true });
  }
  const update = await Blog.findByIdAndUpdate(
    post._id,
    {
      article,
    },
    { new: true }
  );
  res.send({ error: false, message: "post updated successfully.", update });
});
module.exports = app;

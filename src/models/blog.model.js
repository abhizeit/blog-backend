const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    article: {
      type: "string",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    comments: [
      {
        commentString: {
          type: String,
          required: true,
        },
        commentAuthor: {
          type: mongoose.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Blog = mongoose.model("blog", blogSchema);
module.exports = Blog;

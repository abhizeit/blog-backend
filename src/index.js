require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const userRoutes = require("./controllers/user.routes");
const blogRoutes = require("./controllers/blog.routes");
const commenRoutes = require("./controllers/comment.routes");
const likeRoutes = require("./controllers/like.routes");
const trendingRoutes = require("./controllers/trending.routes");
const connect = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URI,
  },
});
io.on("connection", (socket) => {
  console.log(`a new user join on ${socket.id}🚀`);
  socket.on("disconnect", () => {
    console.log(`a user left the wih socket-id ${socket.id}🌇`);
  });
  socket.on("new-blog", (data) => {
    socket.broadcast.emit("new-blog", data);
  });
  socket.on("new-comment", (data) => {
    socket.broadcast.emit("new-comment", data);
  });
  socket.on("delete-comment", (data) => {
    socket.broadcast.emit("delete-comment", data);
  });
  socket.on("delete-blog", (data) => {
    socket.broadcast.emit("delete-blog", data);
  });
  socket.on("add-like", (data) => {
    socket.broadcast.emit("add-like", data);
  });
  socket.on("remove-like", (data) => {
    socket.broadcast.emit("remove-like", data);
  });
  socket.on("update-blog", (data) => {
    socket.broadcast.emit("update-blog", data);
  });
});

app.get("/", (req, res) => {
  res.send("Life is good.");
});

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commenRoutes);
app.use("/likes", likeRoutes);
app.use("/trending", trendingRoutes);

httpServer.listen(process.env.port || 8080, async () => {
  await connect();
  console.log("server is running on port 8080");
});

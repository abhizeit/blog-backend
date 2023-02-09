const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connect = async () => {
  return mongoose.connect(
    process.env.DB_URL || "mongodb://127.0.0.1:27017/dailyBlog"
  );
};

module.exports = connect;

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authmiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.send({ error: true, message: "no token found" });
  }
  try {
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    if (verification) {
      const user = await User.findOne({ email: verification.email });
      if (!user || user.password !== verification.password) {
        return res.send("invalid token found in the request");
      } else {
        req.id = user._id;
      }
    }
    next();
  } catch (e) {
    res.send({
      error: true,
      message: "token has expired. Please login again.",
    });
  }
};

module.exports = authmiddleware;

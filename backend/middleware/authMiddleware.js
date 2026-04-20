const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json("No token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json("User not found");
    }

    req.user = user; // 🔥 THIS IS REQUIRED
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json("Invalid token");
  }
};

const jwt = require("jsonwebtoken");
const SECRET_KEY = "I M SECRET";
const mongoose = require("mongoose");

const fetchUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).send({ error: "Access Denied: No token provided" });
  }
  const payload = await jwt.verify(token, SECRET_KEY);
  req.user = payload.user;
  next();
};

module.exports = fetchUser;

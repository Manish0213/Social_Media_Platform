const mongoose = require("mongoose");
const User = require("../models/authSchema");

const friendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  friendSince: { type: Date, default: Date.now },
});

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;

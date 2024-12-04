const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("../models/authSchema");

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: User, required: true },
  content: { type: String, required: true },
  image: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: User }],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

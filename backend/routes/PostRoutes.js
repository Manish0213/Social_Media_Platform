const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUserMiddleware");
const upload = require("../middleware/multerMiddleware");
const Post = require("../models/PostSchema");
const Friend = require("../models/FriendSchema");

router.get("/friends-posts", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Fetch friends' IDs
    const friends = await Friend.find({ user: userId }).select("friend");
    const friendIds = friends.map((friend) => friend.friend);

    // Step 2: Fetch posts of all friends
    const posts = await Post.find({ user: { $in: friendIds } })
      .populate("user", "name username profileImage") // Populate user details
      .sort({ createdAt: -1 }); // Sort posts by newest first

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/createpost",
  fetchUser,
  upload.single("image"),
  async (req, res) => {
    const { location, content } = req.body;
    const newPost = new Post({
      user: req.user.id,
      content,
      location,
      image: req.file ? `uploads/${req.file.filename}` : null,
    });
    const savedPost = await newPost.save();
    res.send(savedPost);
  }
);

router.post("/like/:postId", fetchUser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const userIndex = post.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      // User has not liked the post, so like it
      post.likes.push(req.user.id);
    } else {
      // User has already liked the post, so unlike it
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/my-posts", fetchUser, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
    .populate("user", "name username profileImage")
    .sort({
      createdAt: -1,
    }); // Optional: sort posts by creation date (newest first)
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID and populate user and likes fields
    const post = await Post.findById(postId).populate(
      "user",
      "name username profileImage"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user-posts/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const userPosts = await Post.find({ user: userId })
      .populate("user", "name username profileImage")
      .sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error. Unable to fetch posts." });
  }
});

router.delete("/delete-post/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error. Unable to delete post." });
  }
});

module.exports = router;

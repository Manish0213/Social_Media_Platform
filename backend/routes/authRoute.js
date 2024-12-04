const express = require("express");
const router = express.Router();
const User = require('../models/authSchema');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUserMiddleware');
const upload = require("../middleware/multerMiddleware");

const SECRET_KEY = "I M SECRET";

router.post("/signup", async(req, res) => {
  const { name, username, password, cPassword } = req.body;
  const isExist = await User.findOne({ username });
  if(isExist){
    return res.status(404).json({success: false, message: "user already exists"});
  }
  if(password!==cPassword){
    return res.status(470).json({success: false, message: "Password and confirm password do not match"});
  }
  const user = new User({name,username,password});
  const newUser = await user.save();

  const payload = {
    user: {
      id: newUser._id
    }
  };
  const authToken = jwt.sign(payload,SECRET_KEY);
  res.status(200).json({success: true, authToken, newUser});
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username});
  if(!user){
    return res.status(400).json({success: false, message: "Signin failed"});
  }
  if(user.password !== password) {
    return res.status(400).json({success: false, message: "Signin failed"});
  }
  else{
    const payload = {
      user: {
        id: user._id
      }
    };
    const authToken = jwt.sign(payload,SECRET_KEY);
    res.status(200).json({success: true, authToken, user});
  }
});

router.get('/userlist', async (req, res) => {
  try {
    const userlist = await User.find({});
    res.status(200).send(userlist); 
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get("/profile", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

router.put("/profile", fetchUser, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, username } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // Example logic for updating user profile in the database
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user info

    // Update query (replace with actual database logic)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, username, ...(profileImage && { profileImage }) },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
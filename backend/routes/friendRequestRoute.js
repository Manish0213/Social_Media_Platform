const express = require("express");
const router = express.Router();
const FriendRequest = require("../models/FriendRequestSchema");
const Friend = require("../models/FriendSchema");
const Chat = require("../models/ChatSchema");
const Message = require("../models/MessageSchema");

router.post("/send-request", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    const savedFriendRequest = await friendRequest.save();

    res.status(200).json(savedFriendRequest);
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request.", error });
  }
});

router.post("/accept-request", async (req, res) => {
  const { requestId } = req.body;

  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    friendRequest.status = "accepted";
    const savedFriendRequest = await friendRequest.save();

    const friend1 = new Friend({ user: friendRequest.sender, friend: friendRequest.receiver });
    const friend2 = new Friend({ user: friendRequest.receiver, friend: friendRequest.sender });
    await friend1.save();
    await friend2.save();

    res.status(200).json(savedFriendRequest);
  } catch (error) {
    res.status(500).json({ message: "Error accepting friend request.", error });
  }
});

// router.delete("/unfriend/:requestId", async (req, res) => {
//   const { requestId } = req.params;
//   const deletedFriendship = await FriendRequest.findByIdAndDelete(requestId);
//   res.send(deletedFriendship);
// });

// router.delete("/unfriend/:requestId", async (req, res) => {
//   const { requestId } = req.params;

//   try {
//     // Find the friend request by ID
//     const friendRequest = await FriendRequest.findById(requestId);

//     if (!friendRequest) {
//       return res.status(404).json({ message: "Friend request not found." });
//     }

//     // Delete the friend request
//     await FriendRequest.findByIdAndDelete(requestId);

//     // Remove friendships from the Friend table
//     await Friend.deleteMany({
//       $or: [
//         { user: friendRequest.sender, friend: friendRequest.receiver },
//         { user: friendRequest.receiver, friend: friendRequest.sender },
//       ],
//     });

//     res.status(200).json({ message: "Unfriended successfully." });
//   } catch (error) {
//     res.status(500).json({ message: "Error while unfriending.", error });
//   }
// });

router.delete("/unfriend/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    // Find the friend request by ID
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    const { sender, receiver } = friendRequest;

    // Delete the friend request
    await FriendRequest.findByIdAndDelete(requestId);

    // Remove friendships from the Friend table
    await Friend.deleteMany({
      $or: [
        { user: sender, friend: receiver },
        { user: receiver, friend: sender },
      ],
    });

    // Delete the chat document(s) involving both users
    await Chat.deleteMany({
      participants: { $all: [sender, receiver] }, // Ensure both users are in the chat
    });

    // Delete the messages associated with those chats
    await Message.deleteMany({
      chat_id: { $in: await Chat.find({ participants: { $all: [sender, receiver] } }).select('_id') }
    });

    res.status(200).json({ message: "Unfriended successfully, chat and messages deleted." });
  } catch (error) {
    console.error("Error while unfriending:", error);
    res.status(500).json({ message: "Error while unfriending.", error });
  }
});

router.get("/getfriendrequest/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    });

    if (!friendRequest) {
      return res.status(200).json({ success: false, status: "none" });
    }

    res.status(200).json({ success: true, friendRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving friend request status.", error });
  }
});

router.delete("/reject-request/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const deletedFriendship = await FriendRequest.findByIdAndDelete(requestId);
  res.send(deletedFriendship);
  console.log(deletedFriendship);
});

router.delete("/cancel-request/:requestId", async (req, res) => {
  const { requestId } = req.params;
  try {
    // Find the friend request by ID
    const friendRequest = await FriendRequest.findById(requestId);

    // If the friend request does not exist, return an error
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    // Check if the request has already been accepted
    if (friendRequest.status === "accepted") {
      return res.status(400).json({ message: "Friend request has already been accepted and cannot be canceled." });
    }

    // Delete the friend request
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ success: true, message: "Friend request canceled successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error canceling friend request.", error });
  }
});

router.get("/received-requests/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const receivedRequests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "name"); // Populate sender details to show who sent the request

    res.json({ success: true, friendRequests: receivedRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const friends = await Friend.find({ user: userId }).populate('friend', 'name');
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends list.', error });
  }
});

module.exports = router;

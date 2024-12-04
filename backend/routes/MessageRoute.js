const express = require("express");
const router = express.Router();
const Chat = require("../models/ChatSchema");
const Message = require("../models/MessageSchema");
const fetchUser = require("../middleware/fetchUserMiddleware");
const User = require("../models/authSchema");

router.get("/getMessages/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat_id: chatId })
      .populate("sender_id", "name email")
      .sort({ createdAt: 1 });

    if (!messages) {
      return res
        .status(404)
        .json({ message: "No messages found for this chat." });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Error fetching messages",
      error: error.message,
    });
  }
});

router.get("/getChatList", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const chatList = await Chat.find({ participants: userId })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 }); // Sort by latest updated chat

    res.status(200).json(chatList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chat list", error: error.message });
  }
});

router.post("/createChat", async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [sender_id, receiver_id] },
    }).populate("participants", "name email");

    if (!chat) {
      const newChat = new Chat({
        participants: [sender_id, receiver_id],
      });

      await newChat.save();
      await newChat.populate("participants", "name email");
      return res.status(201).send(newChat);
    }
    return res.status(201).send(chat);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/sendMessage", async (req, res) => {
  const { sender_id, chat_id, content } = req.body;

  try {
    const newMessage = new Message({
      chat_id: chat_id,
      sender_id: sender_id,
      content: content,
    });
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetchChatWithUser/:chatId", async (req, res) => {
  try {
      const { chatId } = req.params;
      const chatUser = await Chat.findOne({ _id: chatId })
      .populate("participants", "name email")

      if (!chatUser) {
          return res.status(404).json({ message: "Chat not found" });
      }
      res.status(200).json(chatUser);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router;

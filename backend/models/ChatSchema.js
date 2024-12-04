const mongoose = require('mongoose');
const User = require('../models/authSchema');
const Message = require('../models/MessageSchema');

// Define the Chat Schema
const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: Message },
}, { timestamps: true });

// Create the Chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

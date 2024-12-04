const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/authSchema');

const messageSchema = new Schema({
  chat_id: {
    type: Schema.Types.ObjectId,  
    ref: 'Chat',
    required: true
  },
  sender_id: {
    type: Schema.Types.ObjectId, 
    ref: User,
    required: true
  },
  content: {
    type: String, 
    required: true
  },
  created_at: {
    type: Date, 
    default: Date.now
  },
});

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

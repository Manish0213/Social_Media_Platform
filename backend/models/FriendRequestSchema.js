const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/authSchema');

const friendRequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const FriendRequest = mongoose.model('friendRequest', friendRequestSchema);
module.exports = FriendRequest;

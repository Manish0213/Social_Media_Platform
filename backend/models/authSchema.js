const mongoose = require('mongoose');
const {Schema} = mongoose;

const authSchema = new Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: null
    }
})

const User = mongoose.model('user',authSchema);
module.exports = User;
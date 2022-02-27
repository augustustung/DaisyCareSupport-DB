const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Date,
    latestMessageText: String,
    messages: [
        {
            _id: mongoose.Types.ObjectId,
            text: String,
            createdAt: Date,
            isRead: Boolean,
            image: String || null,
            senderId: mongoose.Types.ObjectId
        }
    ]
})

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
const { model, Schema, Types } = require('mongoose');

const UserSchema = new Schema({
    _id: Types.ObjectId,
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    lastActiveAt: {
        type: Date,
        default: new Date()
    }
}, { timestamps: true });

const UserModel = model('User', UserSchema);

module.exports = UserModel;
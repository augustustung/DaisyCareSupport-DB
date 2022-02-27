const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    listToken: [
        {
            type: String
        }
    ]
})

const TokenModel = mongoose.model('Token', TokenSchema);

module.exports = TokenModel;
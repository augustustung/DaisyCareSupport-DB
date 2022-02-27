const UserModel = require('../models/user.model');
const MessageModel = require('../models/message.model');
const mongoose = require('mongoose');
const moment = require('moment');

const getAllChannelOnline = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let conversations = await MessageModel.find({ userId: userId }).populate('adminId').select(['-messages']);
            const start = +moment().startOf('day').toDate();
            const end = +moment().endOf('day').toDate();

            const re = conversations.filter(ad => {
                ad.adminId.password = undefined;
                const lastActiveOfAd = moment(ad.adminId.lastActiveAt).toDate();
                return +lastActiveOfAd >= start && +lastActiveOfAd <= end;
            });
            console.log(re);
            if (re.length > 0)
                resolve({
                    errCode: 0,
                    data: re
                });

            else
                resolve({
                    errCode: 1,
                    errMessage: "No Admins Are Online Now!"
                });
        } catch (err) {
            reject(err);
        }
    })
}

const getDetailInbox = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id, role, skip, limit } = data
            if (!id || !role) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            }
            if (!skip) skip = 0;
            if (!limit) limit = 10;
            if (typeof skip === 'string') skip = parseInt(skip);
            if (typeof limit === 'string') limit = parseInt(limit);
            //if is admin => get user info
            let detailInbox = await MessageModel.findById(id)
                .where('messages').slice([skip, limit]) //[skip, limit]
                .populate(role === "R1" ? "userId" : "adminId");
            if (detailInbox && detailInbox.messages.length > 0)
                resolve({
                    errCode: 0,
                    data: detailInbox
                });
            else
                resolve({
                    errCode: 2,
                    errMessage: "No Message Before. Chat Now!"
                });
        } catch (err) {
            console.log(err);
            reject({
                errCode: -1,
                errMessage: "Error from Server!"
            });
        }
    })
}

const sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                _id,
                senderId,
                createdAt,
                text,
                image
            } = data

            let detailInbox = await MessageModel.findById(_id).exec();

            if (detailInbox) {
                detailInbox.latestMessageText = text;
                detailInbox.messages.unshift({
                    _id: new mongoose.Types.ObjectId,
                    text: text,
                    createdAt: createdAt,
                    isRead: false,
                    image: image ? image : null,
                    senderId: senderId
                });
                await detailInbox.save();
                resolve({
                    errCode: 0,
                    message: "Sent!"
                });
            }
            else {
                resolve({ errCode: 1, errMessage: "Conversation Not Found." });
            }
        } catch (err) {
            console.log(err);
            reject({
                errCode: -1,
                errMessage: "Error from Server!"
            });
        }
    })
}

const getAllMessages = (adminId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!adminId)
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })

            let detailInbox = await MessageModel.find({ adminId: adminId }).populate('userId').exec();

            if (detailInbox) {
                const re = detailInbox.filter(ib => {
                    ib.adminId.password = undefined;
                    return ib.messages && ib.messages.length > 0;
                }) || [];
                resolve({
                    errCode: 0,
                    data: re
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "No Conversation!"
                });
            }
        } catch (err) {
            console.log(err);
            reject({
                errCode: -1,
                errMessage: "Error from Server!"
            });
        }
    })
}

module.exports = {
    getAllChannelOnline,
    getDetailInbox,
    sendMessage,
    getAllMessages
}
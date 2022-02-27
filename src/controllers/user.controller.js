const userService = require('../services/user.service');

const _onGetAllChannelOnline = async (req, res) => {
    try {
        const message = await userService.getAllChannelOnline(req.query.userId);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(201).json(e);
    }
}

const _onGetDetailInbox = async (req, res) => {
    try {
        const message = await userService.getDetailInbox(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(201).json(e);
    }
}

const _onSendMessage = async (req, res) => {
    try {
        const message = await userService.sendMessage(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(201).json(e);
    }
}

const _onAdminGetAllMessages = async (req, res) => {
    try {
        const message = await userService.getAllMessages(req.query.adminId);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(201).json(e);
    }
}

module.exports = {
    _onGetAllChannelOnline,
    _onGetDetailInbox,
    _onSendMessage,
    _onAdminGetAllMessages
}
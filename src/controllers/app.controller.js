const appService = require('../services/app.service');

const _onSignin = async (req, res) => {
    try {
        const message = await appService.SigninService(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(201).json(e);
    }
}

const _onSignup = async (req, res) => {
    const message = await appService.handleSignUpService(req.body);
    return res.status(200).json(message)
}

const _onLogout = async (req, res) => {
    try {
        const message = await appService.handleSignOut(req.body.userId);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(201).json(e);
    }
}

const createEmployee = async (req, res) => {
    try {
        const message = await appService.createEmployee(req.body);
        return res.status(200).json(message);
    } catch(e) {
        return res.status(500).json(e);
    }
}

const uploadNewStaff = async (req, res) => {
    try {
        const message = await appService.uploadService(req.body);
        return res.status(200).json(message);
    } catch(e) {
        return res.status(500).json(e);
    }
}

module.exports = {
    _onSignin,
    _onSignup,
    _onLogout,
    createEmployee,
    uploadNewStaff
}
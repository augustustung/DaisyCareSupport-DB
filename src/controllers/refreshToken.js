const jwt = require('jsonwebtoken');
require('dotenv').config();
const TokenModel = require('../models/token.model');

const _onRefreshToken = async (req, res) => {
    const { userId, token } = req.body;

    if (!token || !userId)
        return res.status(403);
    const refTokenStore = await TokenModel.findOne({ userId: userId })
    if (!refTokenStore.listToken.includes(token))
        return res.status(403);

    const newAccessToken = jwt.sign(
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    refTokenStore.listToken.push(newAccessToken);
    await refTokenStore.save();

    return res.status(200).json({
        errCode: 0,
        token: newAccessToken
    });
}

module.exports = _onRefreshToken;
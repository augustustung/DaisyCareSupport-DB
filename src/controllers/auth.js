const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkAuth = (req, res, next) => {
    try {
        //find token in headers Bearer [token]
        const accessToken = req.headers.authorization.split(" ")[1];
        if (!accessToken)
            return res.status(403);
        else {
            //validate token
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
                if (err) {
                    return res.status(401).json({
                        errCode: 401,
                        message: "Session was out of time!"
                    });
                }
                else {
                    next();
                }
            });

        }
    } catch (error) {
        return res.status(401).json({
            errCode: 401,
            message: "You don't have the right to access!"
        });
    }
};

module.exports = checkAuth
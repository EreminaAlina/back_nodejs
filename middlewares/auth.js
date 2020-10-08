const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');

const secret = 'secret_key'

const checkToken = (req, res, next) => {
    const headers = req.headers;
    if (!headers.authorization) {
        return res.status(400).send("No Auth data");
    }

    jwt.verify(headers.authorization.split(' ')[1], secret, (err, decoded) => {
        if (err) return res.status(401).send("Not valid token");
        Users.findOne({_id: decoded.userId}, (err, user) => {
            if (err || headers.authorization.split(' ')[1] !== user.access_token) {
                return res.status(401).send("Not valid token");
            }
            req.params ? req.params.userId = user._id : req.query.userId = user._id;
            next();
        })
    });
}
module.exports = {
    checkToken
}
const Users = require('../models/users.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
let secret = 'secret_key'

// вход существующего пользователя
const login = (req, res) => {
    let login = req.body && req.body.login;
    let password = req.body && req.body.password;
    if (!login || !password) {
        return res.status(399).send("No login or password");
    }
    Users
        .findOne({login: login})
        .populate({path: 'todos'})
       // .lean()
        .exec(async (err, user) => {
            if (err || !user) {
                return res.status(398).send("Not Found");
            }
            try {
                const validPass = await bcrypt.compare(password, user.password);
                if (validPass) {
                    user.access_token = jwt.sign({userId: user._id}, secret, {expiresIn: '1m'});
                    user.refresh_token = jwt.sign({userId: user._id}, secret, {expiresIn: '30m'});
                    user.save();
                    delete user.password;
                    delete user.__v;
                    return res.send({user});
                } else {
                    return res.status(398).send("Not Correct Password");
                }
            } catch (err) {
                console.log(err);
                return res.status(398).send("cannot check pass");
            }
        })
}

// создание пользователя
const signUp = async (req, res) => {
    try {
        const user = new Users({
            login: req.body.login,
            password: await hashPass(req.body.password)
        });

        user.save().then(data => {
            return res.json(data);
        }).catch(err => {
            return res.status(500).json({
                msg: err.message
            });
        });
    } catch (err) {
        return res.status(501).json({
            msg: err.message
        });
    }
}

const hashPass = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
}

const refreshToken = async (req, res) => {
    console.log(req.body);
    const refresh_token = req.body;
    if (!refresh_token) {
        return res.status(400).send('No refresh token');
    }

    const newToken = jwt.sign({userId: '5f7722faff13677fcf6d9104'}, secret, {expiresIn: '30s'});
    const user = await Users.findOne({_id: '5f7722faff13677fcf6d9104'});
    user.access_token = newToken;
    user.save();
    return res.send(newToken);
}

module.exports = {
    signUp,
    login,
    refreshToken,
};

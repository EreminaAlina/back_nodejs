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
                    user.access_token = jwt.sign({userId: user._id}, secret, {expiresIn: '10m'});
                    user.refresh_token = jwt.sign({userId: user._id}, secret, {expiresIn: '1d'});
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
            password: await hashPass(req.body.password),
            theme: 'pink-bluegrey'
        });

        user.save().then(data => {
            return res.json(data);
        }).catch(err => {
            return res.status(500).json({
                msg: err.message
            });
        });
    } catch (err) {
        console.log(err);
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
    if (!req.body) {
        return res.status(400).send('No data');
    }
    const refresh_token = req.body.refresh_token;
    if (!refresh_token) {
        return res.status(400).send('No refresh token');
    }

    try {
        await jwt.verify(refresh_token, secret);
        const user = await Users.findOne({refresh_token});
        if (user) {
            const newToken = jwt.sign({userId: user._id}, secret, {expiresIn: '10m'});
            const newRToken = jwt.sign({userId: user._id}, secret, {expiresIn: '1d'});
            user.access_token = newToken;
            user.refresh_token = newRToken;
            user.save();
            return res.send({newToken, newRToken});
        } else {
            return res.status(400).send('No user for refresh token');
        }
    } catch (err) {
        if (err.message && err.message.includes('expired')) {
            return res.status(403).send("Refresh token has expired");
        }
        return res.status(400).send('Err on refresh token');
    }
}

const selectTheme = (req, res) => {
    const body = req.body
    if (body) {
        Users.findOneAndUpdate({access_token: req.headers.authorization.split(' ')[1]}, {theme: body.theme}, {new: true}, (err, data) =>{
            if(err){
                res.send('theme not found').status(400);
            } else{
                res.json(data);
            }
        })
    } else {
        return res.send('theme not found').status(400);
    }
}


module.exports = {
    signUp,
    login,
    refreshToken,
    selectTheme
};

const Messages = require('../models/message.model');
const mongoose = require('mongoose');


const getChat = (req, res) => {
    console.log('123');
    Messages.find({}, (err, chat) => {
        if (!err) {
            console.log(chat);
            return res.json(chat);
        } else {
            console.log('iiii', err);
            return res.status(400).send('messages not found');
        }
    });
}

module.exports = {
    getChat,
}

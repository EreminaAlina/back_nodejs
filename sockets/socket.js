const ioObj = require('socket.io');
const Messages = require('../models/message.model');
const mongoose = require('mongoose');
let io;

const initSocket = (http) => {
    io = ioObj(http);

    io.on('connection', (socket) => {
        console.log('a user connected ', socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected ', socket.id);
        });


        socket.on('mmessage', (msg) => {
            socket.broadcast.emit('mmessage', msg);

            let chatMessage = new Messages({
                userName: msg.userName,
                message: msg.message,
                time: msg.time,
                serverStatus: msg.serverStatus
            });
            chatMessage.save((err) => {
                if (err) console.log('cant save this message');

            })

        });

    });
};

module.exports = {
    initSocket,
}

const  express  = require("express");
const  router  =  express.Router();

const chat_controller = require('../controllers/chat.controller');

router.get('/history', chat_controller.getChat);

module.exports  =  router;

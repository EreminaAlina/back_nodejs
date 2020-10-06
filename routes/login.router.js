const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/login.controller');

router.post('/login', login_controller.login);
router.post('/signup', login_controller.signUp);
router.post('/token/refresh', login_controller.refreshToken);


module.exports = router;
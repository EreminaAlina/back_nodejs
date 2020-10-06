const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');

let secret = 'secret_key'


const tasks_controller = require('../controllers/tasks.controller');

const middleware = (req, res, next) => {
    const headers = req.headers;
    if (!headers.authorization) {
        return res.status(400).send("No Auth data");
    }

    jwt.verify(headers.authorization.split(' ')[1], secret, (err, decoded) => {
        console.log(err);
        if (err) return res.status(401).send("Not valid token1");
        Users.findOne({_id: decoded.userId}, (err, user) => {
            if (err || headers.authorization.split(' ')[1] !== user.access_token) {
                return res.status(401).send("Not valid token2");
            }
            next();
        })
    });
}

router.post('/tasks',middleware, tasks_controller.createTask);
router.get('/tasks', middleware, tasks_controller.readTasks);
router.delete('/tasks/:taskId', middleware, tasks_controller.deleteTasks);
router.put('/select/task', middleware, tasks_controller.updateTask);
router.put('/select/tasks', middleware, tasks_controller.updateAll);
router.delete('/delete', middleware, tasks_controller.deleteComp);

module.exports = router;
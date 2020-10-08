const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const tasks_controller = require('../controllers/tasks.controller');

router.post('/tasks', auth.checkToken, tasks_controller.createTask);
router.get('/tasks', auth.checkToken, tasks_controller.readTasks);
router.delete('/tasks/:taskId', auth.checkToken, tasks_controller.deleteTasks);
router.put('/select/task', auth.checkToken, tasks_controller.updateTask);
router.put('/select/tasks', auth.checkToken, tasks_controller.updateAll);
router.delete('/delete', auth.checkToken, tasks_controller.deleteComp);
router.put('/time', auth.checkToken, tasks_controller.setTime);

module.exports = router;
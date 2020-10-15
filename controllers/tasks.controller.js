const Users = require('../models/users.model');
const ToDoItem = require('../models/ToDoItem.model');
const mongoose = require('mongoose');

const createTask = (req, res) => {
    const body = req.body;
    if (!body.text || body.text.trim().length === 0) {
        return res.status(400).send("No Item text");
    }
    if (!body.user) {
        return res.status(400).send("No user for item");
    }
    let todo = new ToDoItem({
        user: mongoose.Types.ObjectId(body.user),
        text: body.text,
        checked: body.checked,
        index: body.index,
        taskTime: body.taskTime
    })
    Users.findOne({_id: todo.user}, (err, user) => {
        if (!err && user) {
            user.todos.push(todo._id);
            user.save();
            todo.save()
                .then(data => {
                    res.json(data);
                })
                .catch(err => {
                    res.status(500).json({
                        msg: err.message
                    });
                });
        } else {
            return res.send('user not found');
        }
    });
}

const readTasks = (req, res) => {
    ToDoItem.find({user: req.query.userId}, '-__v', (err, todos) => {
        if (!err && todos) {
            return res.send(todos);
        } else {
            return res.send('user not found').status(400);
        }
    })
}

const deleteTasks = (req, res) => {
    Users.findOneAndUpdate({login: req.params.userId},
        { $pull: {todos:req.params.taskId}},{new: true},(err, userData) => {
    })

    ToDoItem.findOneAndDelete({_id: req.params.taskId}, (err, todos) => {
        if (!err && todos) {
            return res.send(todos);
        } else {
            return res.send('task not found').status(400);
        }
    })
}
const updateTask = (req, res) => {
    ToDoItem.findOne({_id: req.body._id}, (err, task) => {
        if (!err && task) {
            task.checked = req.body.checked;
            task.save()
                .then(data => {
                    res.json(data);
                })
                .catch(err => {
                    res.status(500).json({
                        msg: err.message
                    });
                });
        } else {
            return res.send('task not found').status(400);
        }
    });
}
const updateAll = (req, res) => {
    const userId = req.body.userId;
    const allCheck = req.body.allCheck;
    ToDoItem.update({user: userId},
        {$set: {checked: allCheck}},
        {multi: true},
        (err, data) => {
            if (err) {
                return res.send('error').statusCode(400)
            }
            return res.send({msg: 'updated'});
        })
}

const deleteComp = (req, res) => {
    ToDoItem.remove({user: req.query.usrId, checked: true}, (err, data) => {
        if (!err && data) {
            res.send({msg: 'clear completed'});
        } else {
            return res.send({err: 'task not found'}).status(400);
        }
    });
}
const setTime = (req, res) => {
    const body = req.body;
    ToDoItem.findOne({_id: body._id}, (err, task) => {
        if (!err && task) {
            task.taskTime = body.taskTime;
            task.save()
                .then(data => {
                    res.json(data);
                })
                .catch(err => {
                    res.status(500).json({
                        msg: err.message
                    });
                });
        } else {
            return res.send('task not found').status(400);
        }
    });
}

module.exports = {
    createTask,
    readTasks,
    deleteTasks,
    updateAll,
    updateTask,
    deleteComp,
    setTime,
};

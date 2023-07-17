const express = require('express');
const route = express.Router();
const controller = require('../controller/taskController');

route.route('/')
    .get(controller.getTasks)
    .post(controller.createTask);

route.route('/:id')
    .get(controller.getTaskByID)
    .patch(controller.updateTask)
    .delete(controller.deleteTask);


module.exports = route;
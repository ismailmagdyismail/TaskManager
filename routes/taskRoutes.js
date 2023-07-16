const express = require('express');
const route = express.Router();
const controller = require('../controller/taskController');

route.route('/')
    .get(controller.getTasks)
    .post(controller.createTask);

//route.route('/:id')
    //.get()
    //.patch()
    //.delete()


module.exports = route;
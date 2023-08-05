const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

router.route('/:id/subtasks/:subId')
    .delete(taskController.deleteSubTask)
    .patch(taskController.updateSubTask)

router.route('/:id')
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask)
    .post(taskController.createSubTask)
    .get(taskController.getTaskById);


router.route('/')
    .get(taskController.getAllTasks)
    .post(taskController.createTask)

module.exports = router;
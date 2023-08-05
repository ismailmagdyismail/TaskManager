const Task = require('../models/taskModel');
const AppError = require('../errorHandlers/AppError');
const asyncWrapper = require('../errorHandlers/asyncWrapper');

module.exports.getAllTasks = asyncWrapper(async function(req,res,next){
    const tasks = await Task.find();
    res.status(200).json({
        status:"success",
        length:tasks.length,
        data:tasks,
    });
});

module.exports.getTaskById = asyncWrapper(async function(req,res,next){
    const task = await Task.findOne({_id:req.params.id});
    if(!task){
         return next(new AppError(404,"Task by this is is not found"));
    }
    res.status(200).json({
        status:"success",
        data:task,
    });
});

module.exports.createTask = asyncWrapper(async function(req,res,next){
    const task = await Task.create(req.body);
    res.status(201).json({
        status:"success",
        data:task,
    });
});
module.exports.createSubTask = asyncWrapper(async function(req,res,next){
    const task = await Task.findOne({_id:req.params.id});
    task.subTasks.push(req.body);
    await task.save();
    res.status(201).json({
        status:"success",
        data:task,
    });
});
module.exports.updateTask = asyncWrapper(async function(req,res,next){
    const task = await Task.findById(req.params.id);
    task.name = req.body.name ?? task.name;
    task.description = req.body.description ?? task.description;
    task.completed = req.body.completed ?? task.completed;
    await task.save();
    if(!task){
        return next(new AppError(404,"Task by this is is not found"));
    }
    res.status(201).json({
        status:"success",
        data:task,
    });
});

module.exports.deleteTask = asyncWrapper(async function(req,res,next){
    const task = await Task.findByIdAndDelete({_id:req.params.id});
    res.status(204).json({
        status:"success",
        data:null,
    });
});

module.exports.deleteSubTask = asyncWrapper(async function(req,res,next){
    const task = await Task.findOne({_id:req.params.id});
    const index = task.subTasks.findIndex(subtask => String(subtask._id) === String(req.params.subId));
    task.subTasks.splice(index,1);
    await task.save();
    res.status(204).json({
        status:"success",
        data:null,
    });
});

module.exports.updateSubTask = asyncWrapper(async function(req,res,next){
    const task = await Task.findOne({_id:req.params.id});
    if(!task){
        return next(new AppError(404,"Task with this id is not found"));
    }
    const index = task.subTasks.findIndex(subtask => String(subtask._id) === String(req.params.subId));
    if(index === -1){
        return next(new AppError(404,"Sub-Task with this id is not found"));
    }
    task.subTasks[index].name  = req.body.name ?? task.subTasks[index].name;
    task.subTasks[index].completed  = req.body.completed ?? task.subTasks[index].completed;
    await task.save();
    res.status(200).json({
        status:"success",
        data:task,
    });
});
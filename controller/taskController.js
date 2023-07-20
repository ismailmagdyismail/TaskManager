const Task = require('../models/taskModel');
const asyncWrapper = require('../errorHandlers/asyncWrapper');

module.exports.getTasks = asyncWrapper(async function getTasks(req,res){
    const tasks = await Task.find({})
    res.status(200).json({
        "status":"success",
        "data":{
            "tasks":tasks
        }
    });
});

module.exports.createTask = asyncWrapper(async function(req,res){
    const task = await Task.create(req.body);
    res.status(201).json({
        "status":"success",
        "data":{
            "tasks":task
        }
    });
});

module.exports.deleteTask = asyncWrapper(async function(req,res){
    if(!req.params.id){
        res.status(400).json({
            "status":"fail",
            "message": "didn't specify ID"
        });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({
        "status":"success",
        "data":null
    });
});

module.exports.getTaskByID = asyncWrapper(async function(req,res){
    if(!req.params.id){
        res.status(400).json({
            "status":"fail",
            "message": "didn't specify ID"
        });
    }
    const task = await Task.find({_id:req.params.id});
    if(!task){
        return res.status(404).json({
            "status":"fail",
            "message": "Not found Task"
        });
    }
    res.status(200).json({
        "status":"success",
        "data":{
            "task":task
        }
    });
});

module.exports.updateTask = asyncWrapper(async function(req,res){
    if(!req.params.id){
        res.status(400).json({
            "status":"fail",
            "message": "didn't specify ID"
        });
    }
    const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
    });
    res.status(200).json({
        "status":"success",
        "data":{
            "task":task
        }
    });
});
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A task must have a name"],
        unique:true,
    },
    description:{
        type:String,
    },
    subTasks:[{
        completed:{
            type:Boolean,
            default:false,
        },
        name:{
            type:String,
            required:true,
            unique:true,
        },
    }],
    completed:{
        type:Boolean,
        default:false,
    },
});


const Task = new mongoose.model('Task',taskSchema);

module.exports = Task;
const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Cannot make a task without a name"],
        min:[1,"A task must contain at least one character"],
        unique:[true,"Each task must have a unique name"],
        trim:true
    },
    completed:{
        type:Boolean,
        default:false,
    }
});


const TaskModel = mongoose.model('Task',taskSchema);

module.exports = TaskModel;
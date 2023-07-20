const express = require('express');
const app = express();

const taskRouter = require('./routes/taskRoutes');
const connectDB = require('./DB/mongooseDB');
const logging = require('morgan');

const globalErrorHandlerMiddleware = require('./errorHandlers/globalErrorHandlerMiddleware');
const AppError = require('./errorHandlers/AppError');

const env = require('dotenv');
env.config({path:'./config.env'});

const PORT = process.env.PORT || 8000;

app.use(express.static('./views'));
app.use(express.json());
app.use(logging('dev'));
app.use('/api/v1/tasks',taskRouter);
app.use((req,res,next)=>{
    next(new AppError(404,"Route not found"));
});
app.use(globalErrorHandlerMiddleware);
async function main(){
    try {
        await connectDB();
        app.listen(PORT,()=>{
            console.log("Started server at port "+PORT);
        });
    }catch (err){
        console.log(err.message);
    }

}

main();

module.exports = app;
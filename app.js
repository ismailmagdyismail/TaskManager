const express = require('express');
const app = express();
const taskRouter = require('./routes/taskRoutes');
const connectDB = require('./DB/mongooseDB');
const logging = require('morgan');

const env = require('dotenv');
env.config({path:'./config.env'});

const PORT = process.env.PORT;

app.use(express.static('./views'));
app.use(express.json());
app.use(logging('dev'));
app.use('/api/v1/tasks',taskRouter);
app.use((req,res,next)=>{
    res.status(404).send("Route not found")
})
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
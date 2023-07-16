const mongoose = require('mongoose');
const env = require('dotenv');
env.config({path:'./config.env'});

const connectionString = process.env.CONNECTION_STRING;
const connectDB = async function (){
   await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    console.log("Successful DB Connection");
}


module.exports = connectDB;
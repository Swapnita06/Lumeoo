const express = require('express')
const app= express();
const mongoose = require('mongoose')
require('dotenv').config()
const userRoute = require('./routes/user_route')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const connectWithdb=async()=>{
    try{
        const res= await mongoose.connect(process.env.MONGO_URI)
        console.log('connected with database');
    }
    catch(err){
        console.error('Database connection failed:', err);
    }
}

connectWithdb();

app.use(bodyParser.json())
app.use(fileUpload.json({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/user',userRoute)

module.exports = app;
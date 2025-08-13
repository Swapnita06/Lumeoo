const express = require('express')
const app= express();
const mongoose = require('mongoose')
require('dotenv').config()
const userRoute = require('./routes/user_route')
const videoRoute = require('./routes/video_route')
const commentRoute = require('./routes/comment_route')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')


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

app.use(cors({
  origin: ['http://localhost:3000','https://lumora-flax.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/user',userRoute)
app.use('/video',videoRoute)
app.use('/comment',commentRoute)
module.exports = app;
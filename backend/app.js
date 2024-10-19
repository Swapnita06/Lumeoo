const express = require('express')
const app= express();
const mongoose = require('mongoose')
require('dotenv').config()

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

module.exports = app;
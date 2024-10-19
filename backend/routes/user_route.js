const express = require('express')
const Router = express.Router();

Router.post('/signup', (req,res)=>{
    console.log(req.body)
    console.log(req.files)
    res.status(200).json({
        msg:'signup succesful!'
    })
})

module.exports = Router
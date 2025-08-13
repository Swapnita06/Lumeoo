const express = require('express')
const Router = express.Router();
const Comment= require('../models/Comment');
const checkAuth = require('../middleware/checkAuth');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

Router.post('/new-comment/:videoId',checkAuth,async(req,res)=>{
    try{
        const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'swapnita singh')
     console.log(verifiedUser)
     const vid = req.params.videoId;
     if(!vid){
        return res.status(400).json({message:'Video id is required'})
     }
     const newComment = new Comment({
        _id:new mongoose.Types.ObjectId,
        videoId:vid,
        userId:verifiedUser._id,
        commentText:req.body.commentText
     })
     const savedcomment= await newComment.save();
     res.status(200).json({
        newComment:savedcomment
     })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})


//get All comments for any video
Router.get('/:videoId',async(req,res)=>{
    try{
const comments = await Comment.find({videoId:req.params.videoId}).populate('userId','channelName logoUrl email')
res.status(200).json({
    commentList:comments
})

    }
    catch(err){
console.log(err)
    }
})

//update coment
Router.put('/:commentId',checkAuth,async(req,res)=>{
    try{
        const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'swapnita singh')
     console.log(verifiedUser)

    const comment =  await Comment.findById(req.params.commentId)
     console.log(comment)

if(comment.userId!= verifiedUser._id){
    return res.status(500).json({
        error:'invalid user'
    })
}
comment.commentText = req.body.commentText;
const updatedComment = await comment.save();
res.status(200).json({
    updatedComment:updatedComment
})
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }
})

//delete coment
Router.delete('/:commentId',checkAuth,async(req,res)=>{
    try{
        const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'swapnita singh')
     console.log(verifiedUser)

    const comment =  await Comment.findById(req.params.commentId)
     console.log(comment)

if(comment.userId!= verifiedUser._id){
    return res.status(500).json({
        error:'invalid user'
    })
}
await Comment.findByIdAndDelete(req.params.commentId)
res.status(200).json({
    deletedData:'success'
})
    }
    catch(err){
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router;
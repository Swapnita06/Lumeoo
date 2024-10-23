const express = require('express');
const Router = express.Router();
const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video')
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

Router.post('/upload',checkAuth,async(req,res)=>{
try{
    const token = req.headers.authorization.split(" ")[1]
    const user = await jwt.verify(token,'swapnita singh')
    // console.log(user)
    // console.log(req.body)
    // console.log(req.files.video)
    // console.log(req.files.thumbnail)
    const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath,{
        resource_type:'video'
    })
    const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
    const newVideo = new Video({
        _id: new mongoose.Types.ObjectId,
        title:req.body.title,
        description:req.body.description,
        user_id:user._id,
        videoUrl:uploadedVideo.secure_url,
        videoId:uploadedVideo.public_id,
        thumbnailUrl:uploadedThumbnail.secure_url,
        thumbnailId:uploadedThumbnail.public_id,
        category:req.body.category,
        tags:req.body.tags.split(",")
         })

        const newUploadedVideoData= await newVideo.save()
        res.status(200).json({
            newVideo:newUploadedVideoData
        })
}
catch(err){
   console.log(err)
   res.status(500).json({
    error:err
   })
}
})

//update video details
Router.put('/:videoId',checkAuth,async(req,res)=>{
    try{
       const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'swapnita singh')
      const video = await Video.findById(req.params.videoId)
      console.log(video)

      if(video.user_id==verifiedUser._id){
        if(req.files){
            //update thumbnail and text data
            await cloudinary.uploader.destroy(video.thumbnailId)
            const updatedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)

            const updatedData= {
                title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        tags:req.body.tags.split(","),
        thumbnailUrl:updatedThumbnail.secure_url,
        thumbnailId:updatedThumbnail.public_id,
            }
           const updatedVideoDetail= await Video.findByIdAndUpdate(req.params.videoId,updatedData,{ new: true });
           console.log("Updated Video Detail:", updatedVideoDetail);
           res.status(200).json({
            updatedVideo:updatedVideoDetail
           });
        }else{
           // const updatedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
            const updatedData= {
                title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        tags:req.body.tags.split(","),
       
            }

           const updatedVideoDetail= await Video.findByIdAndUpdate(req.params.videoId,updatedData,{ new: true });
           res.status(200).json({
            updatedVideo:updatedVideoDetail
        })
    }

      }else{
        return res.status(500).json({
            error:'you have no permission'
        })
      }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router
const express = require('express')
const Router = express.Router();
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});


//this is for signup
Router.post('/signup', async(req,res)=>{
    try{
if (!req.body.email || !req.body.password || !req.body.channelName || !req.files?.logo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if email exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

       const hashCode= await bcrypt.hash(req.body.password,10) 
       const uploadedImg = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
      
       const newUser = new User({
        _id:new mongoose.Types.ObjectId,
        channelName:req.body.channelName,
        email:req.body.email,
        phone:req.body.phone,
        password:hashCode,
        logoUrl:uploadedImg.secure_url,
        logoId:uploadedImg.public_id
       })

       const user = await newUser.save();
    //    res.status(200).json({
    //     newUser:user
    //    })
         res.status(201).json(user);


    }catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


//this is for login.
Router.post('/login',async(req,res)=>{
    console.log(req.body)
    try{
        console.log(req.body)
        const users = await User.find({email:req.body.email})
        console.log(users)
        if(users.length==0){
            return res.status(500).json({
                error:'email is not registered...'
            })
        }

const isValid = await bcrypt.compare(req.body.password,users[0].password)
console.log(isValid)
if(!isValid){
    return res.status(500).json({
        error:'invalid password'
    })
}

const token = jwt.sign({
    _id:users[0]._id,
    channelName:users[0].channelName,
    email:users[0].email,
    phone:users[0].phone,
    logoId:users[0].logoId
},
'swapnita singh',
{
    expiresIn:'365d'
}
)
res.status(200).json({
    _id:users[0]._id,
    channelName:users[0].channelName,
    email:users[0].email,
    phone:users[0].phone,
    logoId:users[0].logoId,
    logoUrl:users[0].logoUrl,
    token:token,
    subscribers:users[0].subscribers,
    subscribedChannels:users[0].subscribedChannels
})

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: 'something is wrong'
        });
    }
})


//subscribe api

// Subscribe to a channel
Router.put('/subscribe/:channelId', checkAuth, async (req, res) => {
    try {
        const subscriberId = req.userData._id; // From checkAuth middleware
        const channelId = req.params.channelId;

 if (!mongoose.Types.ObjectId.isValid(subscriberId) || 
            !mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Prevent self-subscription
        if (subscriberId.toString() === channelId) {
            return res.status(400).json({ error: "You can't subscribe to yourself" });
        }

        const channel = await User.findById(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        // Check if already subscribed
        if (channel.subscribedBy.includes(subscriberId)) {
            return res.status(400).json({ error: 'Already subscribed' });
        }

        // Update channel's subscribers
        channel.subscribers += 1;
        channel.subscribedBy.push(subscriberId);
        await channel.save();

        // Update user's subscribed channels
        const user = await User.findById(subscriberId);
        user.subscribedChannels.push(new mongoose.Types.ObjectId(channelId));

       // user.subscribedChannels.push(channelId);
        await user.save();

        res.status(200).json({ 
            message: 'Subscribed successfully',
            subscribers: channel.subscribers,
            isSubscribed: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Subscription failed',
            details: err.message  });
    }
});

// Unsubscribe from a channel
Router.put('/unsubscribe/:channelId', checkAuth, async (req, res) => {
    try {
        const subscriberId = req.userData._id;
        const channelId = req.params.channelId;

        const channel = await User.findById(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        // Check if actually subscribed
        if (!channel.subscribedBy.includes(subscriberId)) {
            return res.status(400).json({ error: 'Not subscribed' });
        }

        // Update channel's subscribers
        channel.subscribers -= 1;
        channel.subscribedBy = channel.subscribedBy.filter(id => id.toString() !== subscriberId.toString());
        await channel.save();

        // Update user's subscribed channels
        const user = await User.findById(subscriberId);
        user.subscribedChannels = user.subscribedChannels.filter(id => id.toString() !== channelId.toString());
        await user.save();

        res.status(200).json({ 
            message: 'Unsubscribed successfully',
            subscribers: channel.subscribers,
            isSubscribed: false
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unsubscription failed' });
    }
});

// Check subscription status
Router.get('/check-subscription/:channelId', checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        const channelId = req.params.channelId;

        const channel = await User.findById(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const isSubscribed = channel.subscribedBy.some(id => id.toString() === userId.toString());
        res.status(200).json({ isSubscribed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to check subscription status' });
    }
});

Router.get('/:channelId',checkAuth,async(req,res)=>{
    try{
 const channelId= req.params.channelId;
 const channel = await User.findById(channelId);
 if(!channel){
    return res.status(404).json({error:'Channel not found'});
 }
 res.status(200).json(channel);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'Failed to fetch channel'});
    }
})
  

module.exports = Router
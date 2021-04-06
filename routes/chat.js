const Individaul = require('../models/chat/individualConversation')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')



router.get('/getMessages',async (req,res)=>{ 

    const { userSenderID, userReceiverID,} = req.query;
    try{
        let conversation = await Individaul.aggregate([
            { $match: {users : {$all : [mongoose.Types.ObjectId(userSenderID),mongoose.Types.ObjectId(userReceiverID)]}}},
            { "$project": { "users":1,"messages": {$slice : [{$reverseArray:"$messages"},0,2]}
             }} 
        ])
        if(!conversation.length){
            let newConversation = new Individaul({
                users : [userSenderID,userReceiverID]
            })
            await newConversation.save();
            return res.status(200).json({
              success: true,
              conversation: newConversation,
              newConv : true,
            });
        }else{
            res.status(200).json({
                success: true,
                conversation: conversation,
                newConv : false,
            })
        }
        }catch(err){
                console.log(err.message);
                res.status(500).json({
                success: false,
                error: "Internal Server Error",
                })
            }
})


router.post('/sendMessage',async (req,res)=>{

    const {message} = req.body;
    try{
        await Individaul
        .findOneAndUpdate(
            { users : {$all : [message.senderID, message.receiverID]}},
            {$addToSet : {messages : message}},function (error, success) {
                if (error) {
                    console.log(error);
                    res.status(500).json({
                     success: false,
                     error: "Internal Server Error",
                   })
                } else {
                    res.status(200).json({
                     success: true,
                   })
                }
            })
        }catch(err){
                console.log(err.message);
                res.status(500).json({
                success: false,
                error: "Internal Server Error",
                })
            }
})


module.exports = router
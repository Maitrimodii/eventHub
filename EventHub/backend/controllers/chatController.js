const asyncHandler = require('express-async-handler');
const Chat = require('../models/ChatModel');

const getAllChats = asyncHandler( async(req, res, next) => {
    try{
        const userId = req.user._id;

        console.log("userId: ",userId)
        const chats = await Chat.find({
          $or: [
            { 'participants.senderId': userId },
            { 'participants.receiverId': userId }
          ]
        }).populate('participants.receiverId participants.senderId')

        console.log(chats);
        res.status(200).json(chats);
    }catch(error){
        throw new Error(error.message);
    }
}) 

const createChat = asyncHandler(async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user._id;
  
    const existingChat = await Chat.findOne({
      'participants.senderId': senderId,
      'participants.receiverId': receiverId,
    });
  
    if (existingChat) {
      return res.status(200).json(existingChat);
    }
  
    const newChat = await Chat.create({
      participants: [
        {
          senderId,
          receiverId,
        },
      ],
    });
  
    res.status(201).json(newChat);
  });
  
module.exports = { getAllChats, createChat };
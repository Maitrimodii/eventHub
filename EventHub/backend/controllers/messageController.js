const asyncHandler = require('express-async-handler');
const Message = require('../models/MessageModel');
const Chat = require('../models/ChatModel');

const getAllMessage = asyncHandler( async(req,res) => {
    try{
        const chatId = req.params.chatId;
        
        const messages = await Message.find({ chatId: chatId })
        .populate('sender', '_id')
        .populate('receiver', '_id');
       
        console.log(messages)
        res.status(200).json({messages});
    }catch(error){
        res.status(400)
        throw new Error(error.message);
    }
}) 

const sendMessage = asyncHandler( async(req,res) => {
    try{
        const { message,receiverId,chatId } = req.body;
        const senderId = req.user._id;

        console.log("message")
        if(!message || !receiverId){
            console.log("error in recieverID");
            return res.status(400).json({ error: "Message and receiverId are required" });
        }

        const chat = await Chat.findOne({
            'participants.senderId': senderId,
            'participants.receiverId': receiverId,
        })

        const newMessage = await Message.create({
            message,
            chatId,
            sender: senderId,
            receiver: receiverId,
        })

        res.status(201).json(newMessage);

    }catch(error){
        throw new Error(error.message);
    }
})

module.exports = { getAllMessage, sendMessage }
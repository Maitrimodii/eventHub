const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    }
},{timestamps: true})

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;
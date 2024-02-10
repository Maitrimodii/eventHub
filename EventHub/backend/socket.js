const socketIO = require('socket.io');
const Message = require('./models/MessageModel');
const Event = require('./models/EventModel');

const initializeSocket = (server) => {
    const io = socketIO(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:3000",
        },
    });

    let users = [];

    const addUser = (userId, socketId) => {
        !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    }

    const findUser = (userId) => {
        return users.find((user) => user.userId === userId);
    }

    const removeUser = (socketId) => {
        users = users.filter((user) => user.socketId !== socketId);
    }
    
    io.on('connect', (socket) => {
        console.log('a user connected');

        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
          });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
            removeUser(socket.id);
        
            io.emit("getUsers", users);
        });

        socket.on('sendMessage', async(data) => {
            const user = findUser(data.receiverId);

            await Message.create({
                message: data.message,
                chatId: data.chatId,
                sender: data.senderId,
                receiver: data.receiverId,
            })   
            
            if (user) {
                io.to(user.socketId).emit('getMessage', {
                    senderId: data.senderId,
                    message: data.message,
                });
            }
            // const event = await Event.findById(data.chatId).populate('participants');
            // if (event) {
            //     event.participants.forEach((participant) => {
            //         const participantSocket = findUser(participant._id.toString());
            //         if (participantSocket) {
            //             io.to(participantSocket.socketId).emit('getNotification', {
            //                 senderId: data.senderId,
            //                 message: 'You have a new notification from the organizer.',
            //             });
            //         }
            //     });
            // }
        })
        
        socket.on('sendNotification', (data) => {
            const user = findUser(data.receiverId);
            if (user) {
                io.to(user.socketId).emit('getNotification', {
                    senderId: data.senderId,
                    message: data.message,
                });
            }
        });
    });

    return io;
};

module.exports = initializeSocket;

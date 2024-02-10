import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import io from 'socket.io-client';
import {addNotification} from '../actions/notificationActions';
import { setChatOpen, setChatClosed } from '../actions/chatActions';
//import socket from '../socket';

const ChatDisplay = () => {
    const { chatId, receiverId,name } = useParams();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const userLogin = useSelector((state) => state.userLogin);
    // const notifications = useSelector((state) => state.notifications);
    // const { isChatOpen } = useSelector((state) => state.chat);
    const socket = useSelector((state) => state.socket.socket);
    console.log(socket);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const  userInfo  = userLogin.userInfo;

    useEffect(() => {

        dispatch(setChatOpen());
        
        console.log(socket);
        
        if(socket){
        socket.emit('addUser', userInfo._id);
        console.log('Emitting addUser for current user:', userInfo._id);

        // Emit addUser for the receiver
        // newSocket.emit('addUser', receiverId);
        // console.log('Emitting addUser for receiver:', receiverId);

        // Listen for incoming messages
        socket.on('getMessage', ({ senderId, message: newMessage }) => {
            console.log('Received message:', newMessage, 'from sender:', senderId);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: newMessage,
                    sender: senderId,
                    receiver: userInfo._id,
                },
            ]);
        });

        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/message/${chatId}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages);
                    console.log(data.messages);
                } else {
                    console.error('Error fetching messages:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching messages:', error.message);
            }
        };
        
        fetchMessages();

        socket.on('getUsers', (userList) => {
            console.log('Users in the chat:', userList);
        });
      }
        return () => {
            dispatch(setChatClosed());
        };
    }, [userInfo?._id, receiverId, socket]);

    const sendMessage = () => {
        if (socket) {
            
            socket.emit('sendMessage', {
                message,
                chatId,
                senderId: userInfo._id,
                receiverId,
                receiver: receiverId,
            });

            console.log('Message sent:', message, 'to receiver:', receiverId);

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message,
                    chatId,
                    sender: {_id:userInfo._id},
                    receiver: {_id:receiverId},
                },
            ]);

            setMessage('');
        } else {
            console.error('Socket not initialized');
        }
    };

    return (
      <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-gray-800 p-4 text-white fixed w-full top-0 z-10">
        <h2 className="text-xl font-bold">
          Chatting with {name} 
        </h2>
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.sender._id === userInfo._id ? 'text-right' : 'text-left'}`}>
            <span
              className={`px-4 py-2 rounded inline-block ${
                msg.sender._id === userInfo._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            placeholder="Enter your message..."
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded mr-2"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    );
};

export default ChatDisplay;

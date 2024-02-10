import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatList from '../components/ChatList';
import { useSelector } from 'react-redux';

//const socket = io('http://localhost:5000');

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChats, setSelectedChats] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    axios
      .get('/api/chat', config)
      .then((response) => {
        console.log(response.data);
        setChats(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userInfo.token]); 

  const onSelectChat = (chatId) => {
    setSelectedChats(chatId);
  };

  return (
    <div style={{ display: 'flex' }}>
      <ChatList chats={chats} currentUserId={userInfo._id}/>
    </div>
  );
};

export default Chat;

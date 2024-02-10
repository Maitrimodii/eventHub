import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ chats, currentUserId }) => {
  const navigate = useNavigate();

  const [receiverId, setReceiverId] = useState(null);

  const handleChat = (chatId, receiverId, name) => {
    // Use receiverId state to navigate or perform any other logic
    navigate(`/chatDisplay/${chatId}/${receiverId}/${name}`);
  };

  return (
    <div className="container mx-auto p-4 mt-6 md:w-1/2 shadow-lg rounded-xl bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {chats.map((chat) => {
        const participantId =
          currentUserId === chat.participants[0].senderId._id
            ? chat.participants[0].receiverId._id
            : chat.participants[0].senderId._id;

        return (
          <div key={chat._id} className="bg-white shadow-md p-4 mb-4 transition duration-300 hover:shadow-xl rounded-lg">
            <div className='flex justify-between items-center'>
              <p className="text-lg font-semibold">
                {currentUserId === chat.participants[0].senderId._id
                  ? chat.participants[0].receiverId.name
                  : chat.participants[0].senderId.name}
              </p>

              <button
                onClick={() => handleChat(chat._id, participantId, currentUserId === chat.participants[0].senderId._id
                  ? chat.participants[0].receiverId.name
                  : chat.participants[0].senderId.name)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Chat
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;

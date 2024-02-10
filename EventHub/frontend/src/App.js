import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import CreateEvent from './pages/CreateEvent';
import ViewEvent from './pages/ViewEvent';
import EventRegistration from './pages/EventRegistration';
import QrScan from './pages/QrScan';
import MyEvents from './pages/MyEvents';
import AllEvent from './pages/AllEvent';
import ViewAttendy from './pages/ViewAttendy';
import Calendar from './pages/Calendar';
import Chat from './pages/Chat';
import ChatDisplay from './components/ChatDisplay';
import UpdateEvent from './pages/UpdateEvent';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from './actions/notificationActions';
import { clearSocket, setSocket } from './actions/socketActions';
import ResourceUpload from './pages/ResourceUpload';
import ViewResources from './pages/ViewResources';

//const navigate = useNavigate();
const PrivateRouteForOrganizer = ({ element }) => {
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  return userInfo.role === 'organiser' ? element : <Navigate to="/" />;
};

const PrivateRouteForAttendee = ({ element }) => {
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  return userInfo.role === 'attendee' ? element : <Navigate to="/" />;
};

const App = () => {
 // const dispatch = useDispatch();
  // const isChatOpen = useSelector((state) => state.chat.isChatOpen);

  // console.log(isChatOpen);
  // useEffect(() => {
  //     const socketUrl = 'http://localhost:5000';
  //     const socket = io(socketUrl);
  //     dispatch(setSocket(socket));
  
  //     console.log(socket);
  //     socket.on('connection', () => {
  //       console.log('Connected to server');
  //     });
  
  //     socket.emit('addUser', userInfo._id);
  //     console.log('Emitting addUser for current user:', userInfo._id);
  //     socket.on('getMessage', ({ senderId, message: newMessage }) => {
  //       console.log('Received message:', newMessage, 'from sender:', senderId);
  
  //       if (!isChatOpen) {
  //         dispatch(addNotification({
  //           senderId,
  //           message: 'You have a new message',
  //         }));
  //       }
  //     });
  //     socket.on('connect', () => {
  //       console.log('Connected to server');
  //     });
    
  //     socket.on('disconnect', () => {
  //       console.log('Disconnected from server');
  //     });
    
  //     dispatch(setSocket(socket));
    
  //     return () => {
  //       socket.disconnect();
  //       dispatch(clearSocket());
  //     };
  //   }, [dispatch, isChatOpen]);
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/create-event"
        element={<PrivateRouteForOrganizer element={<CreateEvent />} />}
      />
      <Route path="/scanQr" element={<PrivateRouteForOrganizer element={<QrScan />} />} />
      <Route path="/MyEvent" element={<PrivateRouteForOrganizer element={<MyEvents />} />} />
      <Route path="/updateEvent/:eventId" element={<PrivateRouteForOrganizer element={<UpdateEvent />} />} />
      <Route path="/upload-file" element={<PrivateRouteForOrganizer element={<ResourceUpload />} />} />
      <Route
        path="/participants/:eventId"
        element={<PrivateRouteForOrganizer element={<ViewAttendy />} />}
      />
      <Route path="/calendar" element={<PrivateRouteForAttendee element={<Calendar />} />} />
      <Route path="/view-event" element={<ViewEvent />} />
      <Route path="/register/:eventId/:fees/:days" element={<EventRegistration />} />
      <Route path="/AllEvent" element={<AllEvent />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chatDisplay/:chatId/:receiverId/:name" element={<ChatDisplay />} />
      <Route path="/view-resources" element={<ViewResources />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App


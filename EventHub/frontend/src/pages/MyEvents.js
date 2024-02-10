import React from 'react';
import ViewEvent from './ViewEvent';
import { useNavigate } from 'react-router-dom';

const MyEvents = () => {
  const navigate = useNavigate();

  const handleButton = (selectedEvent) => {
    navigate(`/participants/${selectedEvent._id}`);
  };

  return <ViewEvent apiEndpoint="/api/event/myEvent" handleButtonCallback={handleButton} />;
}

export default MyEvents;

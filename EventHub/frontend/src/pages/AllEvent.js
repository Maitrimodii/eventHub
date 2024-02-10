import React from 'react'
import ViewEvent from './ViewEvent'
import { useNavigate } from 'react-router-dom';

const AllEvent = () => {
  const navigate = useNavigate();

  const handleButton = (selectedEvent) => {
    navigate(`/register/${selectedEvent._id}/${selectedEvent.fees}/${selectedEvent.days.length}`);
  };
  return (
    <ViewEvent apiEndpoint="/api/event/all-events" handleButtonCallback={handleButton}/>
  )
}

export default AllEvent
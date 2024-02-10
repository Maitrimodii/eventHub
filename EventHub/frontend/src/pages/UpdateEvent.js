import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CreateEventForm from './CreateEventForm';
import { useParams } from 'react-router-dom';

const UpdateEvent = () => {
  const [event, setEvent] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    fees: '',
    applyBy: '',
    days: [],
  });

  const { eventId } = useParams();

  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin.userInfo;
  const [loading, setLoading] = useState(true);

  const fetchEventData = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.get(`/api/event/get-event/${eventId}`, config);
      setEvent(response.data.event);
      console.log(response.data.event);
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId, userInfo.token]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleUpdate = async() => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.put(`/api/event/update-event/${eventId}`, event, config);
      setEvent(response.data.event);
     
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    handleUpdate();
  };

  const buttonName = 'Update';

  
  if (event && event.title) {
    return (
      <CreateEventForm
        event={event}
        setEvent={setEvent}
        onSubmit={handleFormSubmit}
        buttonName={buttonName}
      />
    );
  }
//   return(
//     <>
//     {console.log("event",event)};
//     </>
//   )
};

export default UpdateEvent;

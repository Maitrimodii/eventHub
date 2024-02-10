import React, { useState } from 'react';
import CreateEventForm from './CreateEventForm';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateEvent = () => {
    const [event, setEvent] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        fees: '',
        applyBy: '',
        days: [],
    });
    const userLogin = useSelector((state) => state.userLogin);
    const userInfo = userLogin.userInfo;

    const handleFormSubmit = () => {
      const config = {
          headers: {
              Authorization: `Bearer ${userInfo.token}`,
          },
      };
      axios.post('/api/event/create-event', event, config)
          .then((response) => {
              console.log('Successful creation:', response.data);
          })
          .catch((error) => {
              console.error('Error creating event:', error);
      });
    };

    return (
        <div className="container mx-auto mt-10">
            <CreateEventForm
                event={event}
                setEvent={setEvent}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default CreateEvent;

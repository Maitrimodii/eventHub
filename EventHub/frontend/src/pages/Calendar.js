import React, { useEffect, useState } from 'react'
//import { Scheduler } from "@aldabil/react-scheduler";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from 'react-redux';
import axios from 'axios';

const Calendar = () => {
    const userLogin = useSelector((state) => (state.userLogin));

    const userInfo = userLogin.userInfo;
    const [events, setEvents] = useState([]);

   useEffect(() => {
    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    const fetchMyEvents = async() => {
        const response = await axios.get(`/api/registerdEvents`, config);
        const formattedEvents = [];
    
        response.data.myEvents.forEach(event => {
            event.days.forEach(day => {
                const formattedEvent = {
                    title: event.title,
                    start: day.startTime,
                    end: day.endTime,
                    allDay: false,
                };
                formattedEvents.push(formattedEvent);
            });
        });
    
        console.log("event:", response.data.myEvents);
        console.log(formattedEvents);
        setEvents(formattedEvents);
    }
    fetchMyEvents();
   },[userInfo]);
  return (
    <div>
        <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView = {"dayGridMonth"}
        headerToolbar = {{
            start: "today prev, next",
            center: "title",
            end: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        eventContent={(arg) => {
            return (
                <div
                    style={{
                        backgroundColor: arg.event.backgroundColor,
                        borderColor: arg.event.borderColor,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        padding: '3px',
                        borderRadius: '3px',
                        transition: 'background-color 0.2s ease',
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center'
                        
                    }}
                >
                    {arg.timeText}
                    <br />
                    {arg.event.title}

                </div>
            );
        }}
        height={"90vh"}
        events={events}
        />
        {console.log(events)}
    </div>
  )
}

export default Calendar
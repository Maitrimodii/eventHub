import React, { useState } from 'react';
import moment from 'moment';
import DayForm from '../components/DayForm';
import { MdDelete } from "react-icons/md";

const CreateEventForm = ({ event, setEvent, buttonName = "Create", onSubmit }) => {
    
    const [showDayForm, setShowDayForm] = useState(false);


    const handleFormSubmit = (e) => {
        onSubmit(event); 
    };

    const addDay = (newDay) => {
        const formattedDay = {
          ...newDay,
          startTime: new Date(`${newDay.date}T${newDay.startTime}:00`),
          endTime: new Date(`${newDay.date}T${newDay.endTime}:00`),
        };
      
        setEvent((prevEvent) => ({ ...prevEvent, days: [...prevEvent.days, formattedDay] }));
      };
      
    const cancelDayForm = () => {
        setShowDayForm(false);
    };
    
    const deleteDay = (index) => {
        setEvent((prevEvent) => ({
          ...prevEvent,
          days: prevEvent.days.filter((_, i) => i !== index),
        }));
    };
    
    return (
        <div className="container mx-auto mt-10">
            <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-xl min-w-2xl shadow-lg border mb-6">
                <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">{buttonName} Event</h2>
                <label className="block mb-2 text-gray-700">Title:</label>
                <input
                    type="text"
                    value={event.title}
                    onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <label className="block mt-4 mb-2 text-gray-700">Description:</label>
                <textarea
                    value={event.description}
                    onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <label className="block mt-4 mb-2 text-gray-700">Category:</label>
                <select
                    value={event.category}
                    onChange={(e) => setEvent({ ...event, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="" disabled>Select a category</option>
                    <option value="event">Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="conference">Conference</option>
                </select>           

                <label className="block mt-4 mb-2 text-gray-700">Location:</label>
                <input
                    type="text"
                    value={event.location}
                    onChange={(e) => setEvent({ ...event, location: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                
                <label className="block mt-4 mb-2 text-gray-700">Fees:</label>
                <input
                    type="text"
                    value={event.fees}
                    onChange={(e) => setEvent({ ...event, fees: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                
                <label className="block mt-4 mb-2 text-gray-700">Apply By:</label>
                <input
                    type="date"
                    value={moment(event.applyBy).format('YYYY-MM-DD')}
                    onChange={(e) => setEvent({ ...event, applyBy: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                
                <label className="block mt-4 mb-2 text-gray-700">Days: </label>
                    <div>
                    {event.days.map((day, index) => (
                    <div key={index} className="mb-4 bg-white px-4 py-2 rounded-md shadow-md">
                        <div className='flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <p className="text-base">Date: {moment(day.date).format('DD-MM-YYYY')}</p>
                            <p className="text-base">Time: {moment(day.startTime).format('HH:mm')} to {moment(day.endTime).format('HH:mm')}</p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-base'>{day.lunchIncluded && 'Lunch Included'}</p>
                            <p className='text-base'>{day.dinnerIncluded && 'Dinner Included'}</p>
                            <p className='text-base'>{day.refreshmentIncluded && 'Refreshment Included'}</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => deleteDay(index)} 
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                            <MdDelete />
                        </button>
                        </div>
                    </div>
                    ))}
                    {showDayForm ? (
                        <DayForm
                        onAddDay={addDay}
                        onCancel={cancelDayForm}
                        isOpen={showDayForm}
                        onRequestClose={() => setShowDayForm(false)}
                        />
                    ) : (
                        <button
                        type="button"
                        onClick={() => setShowDayForm(true)}
                        className="text-secondary hover:underline focus:outline-none text-base"
                        >
                        + Add Day
                        </button>
                    )}
                    </div>
                <button type="submit" className="mt-6 bg-secondary text-white p-2 w-full rounded hover:darkerSecondary">{buttonName}</button>
            </form>
        </div>
    );
};

export default CreateEventForm;

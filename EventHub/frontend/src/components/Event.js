import React from 'react';
import moment from 'moment';
import { GrNext } from 'react-icons/gr';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Event = ({ events, handleSelected, onPageChange, page }) => {
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM Do, YYYY');
  };

  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin.userInfo;

  const navigate = useNavigate();

  const handleUpdateButton = (eventId) => {
    navigate(`/updateEvent/${eventId}`);
  };

  const handleDeleteButton = (eventId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    axios
      .delete(`/api/event/delete-event/${eventId}`, config)
      .then((response) => {
        console.log('Successful deletion:', response.data);
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
      });
  };

  return (
    <div className='container mx-auto mt-10'>
      <div className='flex flex-col md:flex-row'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:mt-0'>
          {events && events.length ? (
            <>
              {events.map((event, index) => (
                <div
                  key={index}
                  className='bg-gray rounded-md mx-3 mb-4 md:ml-0 md:mb-0 md:w-full lg:w-6xl lg:mb-4 shadow-md p-5 flex flex-col justify-evenly hover:shadow-xl border-l-2 border-darkerSecondary duration-300'
                >
                  <div className='border-b-2 pb-1'>
                    <span className='text-[1.3rem] font-bold'>{event.title}</span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 leading-6 text-sm md:text-base mt-2'>
                    <div className=''>
                      <h1 className='text-gray-600 font-bold'>
                        Category:{' '}
                        <span className='text-darkerSecondary'>{event.category}</span>
                      </h1>
                      <h1 className='text-gray-600 font-bold '>
                        Location:{' '}
                        <span className='text-darkerSecondary'>{event.location}</span>
                      </h1>
                    </div>
                    <div className=''>
                      <h1 className='text-gray-600 font-bold '>
                        Organizer:{' '}
                        <span className='text-darkerSecondary'>{event.organizer.name}</span>
                      </h1>
                      <h1 className='text-gray-600 font-bold '>
                        Date:{' '}
                        <span className='text-darkerSecondary'>{formatDate(event.date)}</span>
                      </h1>
                    </div>
                  </div>
                  <div className={`flex ${userInfo.role==="organiser" ?'justify-between' : 'justify-end'} mr-5 items-center md:mt-2`}>
                  {userInfo.role==="organiser" && 
                    <div className='flex text-2xl'>
                      <button onClick={() => handleUpdateButton(event._id)}>
                        <CiEdit className='mr-8 hover:text-darkerSecondary duration-200 md:text-md' />
                      </button>
                      <button onClick={() => handleDeleteButton(event._id)}>
                        <MdDelete className='hover:text-darkerSecondary duration-200 md:text-md' />
                      </button>
                    </div>
                  }
                   
                    <button
                      className='bg-darkerSecondary text-white p-2 md:p-2 lg:p-3 rounded-full text-sm md:text-md flex flex-col justify-evenly hover:translate-x-1 hover:bg-lightSecondary duration-300'
                     // className="bg-gray rounded-md mx-3 mb-4 md:ml-0 md:mb-0 md:w-[35rem] shadow-md h-[13rem] p-5 flex flex-col justify-evenly hover:shadow-xl border-l-2 border-darkerSecondary duration-300"
                      onClick={() => handleSelected(event)}
                    >
                      <GrNext />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h1 className='col-span-full text-center'>No event found</h1>
          )}
        </div>
      </div>
      {events.length>10 && <div className='flex justify-center mt-4'>
        <button
          onClick={() => onPageChange('prev')}
          disabled={page === 1}
          className='bg-darkerSecondary text-white p-2 md:p-2 lg:p-3 rounded-full text-sm md:text-md hover:bg-lightSecondary duration-300 mr-2'
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange('next')}
          disabled={events.length < 10} // Assuming you have a fixed page size of 10
          className='bg-darkerSecondary text-white p-2 md:p-2 lg:p-3 rounded-full text-sm md:text-md hover:bg-lightSecondary duration-300'
        >
          Next
        </button>
      </div>}
      
    </div>
  );
};

export default Event;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Filter from '../components/Filter';
import Event from '../components/Event';
import Modal from 'react-modal';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ViewEvent = ({ apiEndpoint, handleButtonCallback }) => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    keyWordSearch: '',
    sort: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin.userInfo;

  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      params: {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      },
    };

    axios
      .get(apiEndpoint, config)
      .then((response) => {
        setEvents(response.data.events);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [filters, userInfo]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
    setPagination((prevPagination) => ({ ...prevPagination, page: 1 }));
  };

  const handleSortChange = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, sort: value }));
  };

  const handleSearchChange = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, keyWordSearch: value }));
    setPagination((prevPagination) => ({ ...prevPagination, page: 1 }));
  };

  const handlePageChange = (direction) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: direction === 'next' ? prevPagination.page + 1 : prevPagination.page - 1,
    }));
  };

  const handleSelected = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleButton = () => {
    setIsModalOpen(false);
    handleButtonCallback(selectedEvent);
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MMM Do, YYYY');
  };

  const handleQueryButton = async (receiverId) => {
    try {
      console.log(receiverId);
      const response = await axios.post(
        '/api/chat/create',
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const chatId = response.data._id;

      console.log(chatId);
      navigate(`/chatDisplay/${chatId}/${receiverId}`);
    } catch (error) {
      console.error(error);
    }
  }

  const placeholderData = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
    mollit anim id est laborum.
  `;

  // Toggle button logic
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <>
      <button
      onClick={toggleFilter}
      className='block md:hidden bg-darkerSecondary text-white px-4 py-2 rounded-md mt-4 mb-2 mx-4 focus:outline-none hover:bg-secondary'
    >
      {showFilter ? 'Hide Filter' : 'Show Filter'}
    </button>
    <div className='flex'>
        {/* Filter component */}
        <div className={`w-full md:w-1/4 ${showFilter ? 'block' : 'hidden md:block'}`}>
            <Filter
              filters={filters}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onSearchChange={handleSearchChange}
            />
        </div>

        {/* Event component */}
        <div className={`w-full p-25 md:w-3/4 md:pl-4 ${showFilter ? 'hidden md:block' : 'block'}`}>
          <Event
            events={events}
            onPageChange={handlePageChange}
            handleSelected={handleSelected}
            page={pagination.page}
          />
        {/* Modal component */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className='relative w-full max-w-3xl min-w-lg h-full md:h-auto bg-white rounded-lg p-8'
          overlayClassName='modal-overlay fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'
          ariaHideApp={false}
        >
          <button
            onClick={closeModal}
            className='text-lg absolute top-4 right-4 text-gray-500 hover:text-gray-400 focus:outline-none'
          >
            X
          </button>
          <div className='flex flex-col'>
            <div className='mb-4'>
              <p className='font-bold text-xl text-center mb-2 p-4'>Event Details</p>
              <hr className='border-gray-200' />
            </div>
          <div className="flex items-start mb-4">
            <p className="font-bold w-1/2 p-2">Title: </p>
            <p className="w-1/2 p-2">{selectedEvent.title}</p>
          </div>
          <hr className="border-gray-400" />
          <div className="flex items-start mb-4">
            <p className="font-bold w-1/2 p-2">Description: </p>
            {/* <p className="w-1/2 p-2">{selectedEvent.organizer.date}</p> */}
            <p className="w-1/2 p-2">{placeholderData}</p>
          </div>
          <hr className="border-gray-400" />
          <div className="flex items-start mb-4">
            <p className="font-bold w-1/2 p-2">Location :</p>
            <p className="w-1/2 p-2">{selectedEvent.location}</p>
          </div>
          <hr className="border-gray-400" />
          <div className="flex items-start mb-4">
            <p className="font-bold w-1/2 p-2">Fees :</p>
            <p className="w-1/2 p-2"> {selectedEvent.fees === 0 ? "free": selectedEvent.fees}</p>
          </div>
          <hr className="border-gray-400" />
          <div className="flex items-start mb-4">
            <p className="font-bold w-1/2 p-2">Apply By: </p>
            <p className="w-1/2 p-2">{formatDate(selectedEvent.applyBy)}</p>
          </div>
          {userInfo.role === "attendee" && <p
            onClick={()=>{handleQueryButton(selectedEvent.organizer._id)}}
            className="tex-blue-500 hover px-4 py-2 p-4 "
          >
            Does have any query ?
          </p>}
          <button
            onClick={handleButton}
            className="bg-blue-500 text-white px-4 py-2 p-4 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:border-blue-300"
          >
            Apply
          </button>
        </div>
      </Modal>
      </div>
    </div>
    </>
  )
}
export default ViewEvent;
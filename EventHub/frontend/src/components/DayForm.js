import React, { useState } from 'react';
import Modal from 'react-modal';

const DayForm = ({onAddDay, onCancel, isOpen, onRequestClose }) => {
  const [dayDetails, setDayDetails] = useState({
    date: '',
    startTime: '',
    endTime: '',
    lunchIncluded: false,
    dinnerIncluded: false,
    refreshmentIncluded: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setDayDetails({
      ...dayDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDay(dayDetails);
    setDayDetails({
      date: '',
      startTime: '',
      endTime: '',
      lunchIncluded: false,
      dinnerIncluded: false,
      refreshmentIncluded: false,
    });
    onRequestClose();
  };

  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="modal-content bg-white p-8 rounded-md mx-auto my-12 max-w-md text-center relative"
        overlayClassName="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        ariaHideApp={false}
    >
      {/* Add form fields for day details */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
        <input
          type="date"
          name="date"
          value={dayDetails.date}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Start Time:</label>
        <input
          type="time"
          name="startTime"
          value={dayDetails.startTime}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">End Time:</label>
        <input
          type="time"
          name="endTime"
          value={dayDetails.endTime}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          <input
            type="checkbox"
            name="lunchIncluded"
            checked={dayDetails.lunchIncluded}
            onChange={handleInputChange}
            className="mr-2"
          />
          Lunch Included
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          <input
            type="checkbox"
            name="dinnerIncluded"
            checked={dayDetails.dinnerIncluded}
            onChange={handleInputChange}
            className="mr-2"
          />
          Dinner Included
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          <input
            type="checkbox"
            name="refreshmentIncluded"
            checked={dayDetails.refreshmentIncluded}
            onChange={handleInputChange}
            className="mr-2"
          />
          Refreshment Included
        </label>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
        >
          Add Day
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DayForm;

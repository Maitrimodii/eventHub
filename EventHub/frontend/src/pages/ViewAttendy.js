import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ViewAttendy = () => {
  const [participants, setParticipants] = useState([]);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const { eventId } = useParams();

  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin.userInfo;

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`/api/event/participants/${eventId}`, config);
        setParticipants(response.data.participants);
        setNumberOfDays(response.data.days);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [eventId]);

  return (
    <div className="container mx-auto mt-8 overflow-x-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Participants List</h2>
      <table className="min-w-full border border-collapse border-gray-800">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border text-lg">Name</th>
            <th className="py-2 px-4 border text-lg">Email</th>
            <th className="py-2 px-4 border text-lg">Contact No</th>
            {Array.from({ length: numberOfDays }, (_, index) => (
              <th key={index + 1} className="py-2 px-4 border text-lg">
                Day {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, rowIndex) => (
            <tr key={participant._id} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="py-2 px-4 border">{participant.name}</td>
              <td className="py-2 px-4 border">{participant.email}</td>
              <td className="py-2 px-4 border">{participant.contactNo}</td>
              {Array.from({ length: numberOfDays }, (_, index) => (
                <td
                  key={index + 1}
                  className={`py-2 px-4 border ${
                    participant.attendance[index]
                      ? 'text-green-600 font-bold'
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {participant.attendance[index] ? 'Present' : 'Absent'}
                </td>
            ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAttendy;

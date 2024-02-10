// Notifications.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotifications } from '../actions/notificationActions';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  const handleNotificationClick = () => {
    // Dispatch an action to clear notifications when the bell icon is clicked
    dispatch(clearNotifications());
  };

  return (
    <div className="relative group">
      <div className="flex items-center cursor-pointer" onClick={handleNotificationClick}>
        <div className="bell-icon text-white">
          🔔
          {notifications.length > 0 && (
            <span className="notification-count bg-red-500 text-xs text-white px-2 py-1 rounded-full ml-1">
              {notifications.length}
            </span>
          )}
        </div>
      </div>
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg group-hover:block hidden">
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item p-2">
              {notification.message}
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

import { ADD_NOTIFICATION, CLEAR_NOTIFICATIONS } from "../constants/notificationConstants";

export const addNotification = (notification) => (dispatch) => {
  dispatch({ type: ADD_NOTIFICATION, payload: notification });
  console.log(notification);
};
  
export const clearNotifications = () => (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATIONS });
};

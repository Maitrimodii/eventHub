import { ADD_NOTIFICATION, CLEAR_NOTIFICATIONS } from "../constants/notificationConstants";

const initialState = [];

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [...state, action.payload];
    case CLEAR_NOTIFICATIONS:
      return [];
    default:
      return state;
  }
};

export default notificationReducer;
// src/reducers/chatReducer.js
const initialState = {
    isChatOpen: false,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CHAT_OPEN':
            return {
                ...state,
                isChatOpen: true,
            };
        case 'SET_CHAT_CLOSED':
            return {
                ...state,
                isChatOpen: false,
            };
        default:
            return state;
    }
};

export default chatReducer;

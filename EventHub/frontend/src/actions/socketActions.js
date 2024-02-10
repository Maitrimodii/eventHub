export const setSocket = (socket) => async (dispatch) => {
    dispatch({
    type: 'SET_SOCKET',
    payload: socket,
    });
};

export const clearSocket = () => async (dispatch) => {
    dispatch({ type: 'CLEAR_SOCKET' });
};

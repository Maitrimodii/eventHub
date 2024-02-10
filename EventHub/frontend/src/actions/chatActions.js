// src/actions/chatActions.js

export const setChatClosed=()=>async (dispatch)=>{
    dispatch({type: 'SET_CHAT_CLOSED'});
}
export const setChatOpen=()=>async (dispatch)=>{
    dispatch({type: 'SET_CHAT_OPEN'});
}

  
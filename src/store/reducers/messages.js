import actionTypes from '../actions/actionTypes'
const initialState = {
    isLoading: false,
    messageDetails: []
}

const messagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PROCESS_MESSAGE_ACTION:
            return {
                ...state,
                isLoading: true
            }
        case actionTypes.MESSAGES_REQUESTED:
            return {
                ...state,
                messageDetails: action.payload,
                isLoading: false
            }
        case actionTypes.NEW_MESSAGE_ADDED:
            return {
                ...state,
                isLoading: false
            }
        case actionTypes.PROCESS_MESSAGE_ACTION_FAILED:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}

export default messagesReducer;
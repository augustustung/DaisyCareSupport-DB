import actionTypes from "./actionTypes";
import * as SERVICES from '../../services'
import { toast } from "react-toastify";

export const loadConversation = (userId, userRole, token) => async (dispatch) => {
    dispatch({
        type: actionTypes.PROCESS_MESSAGE_ACTION
    })

    let res = {};
    if (userRole === "R2")
        res = await SERVICES.userGetAllAdminOnline(userId, token)
    else
        res = await SERVICES.adminGetAllConversation(userId, token)
    if (res) {
        if (res === 401) {
            let newToken = await refreshToken(userId, token)
            if (newToken) {
                toast.error('Request out of time. Let try again!')
                dispatch({
                    type: actionTypes.UPDATE_TOKEN,
                    token: newToken
                })
            }
            //get new token if cant redirect /login
            else
                clearAll()
        } else if (res === 403) {
            //force to /login
            clearAll()
        } else {
            dispatch({
                type: actionTypes.CONVERSATIONS_LOADED,
                payload: {
                    conversations: res.data && res.data
                }
            })
        }
    } else
        dispatch({
            type: actionTypes.PROCESS_MESSAGE_ACTION_FAILED
        })
}

export const conversationChanged = (data) => async (dispatch) => {
    dispatch({
        type: 'SELECTED_CONVERSATION_CHANGED',
        conversationId: data.conversationId
    })
};

export const conversationsRequested = () => ({
    type: 'CONVERSATIONS_REQUESTED'
});

export const conversationDeleted = () => ({
    type: 'DELETE_CONVERSATION'
});

export const newMessageAdded = (data) => async (dispatch) => {
    dispatch({
        type: actionTypes.PROCESS_MESSAGE_ACTION
    })

    let res = await SERVICES.sendMessage(data)
    if (res) {
        if (res === 401) {
            let newToken = await refreshToken(data.userId, data.token)
            if (newToken) {
                toast.error('Request out of time. Let try again!')
                dispatch({
                    type: actionTypes.UPDATE_TOKEN,
                    token: newToken
                })
            }
            //get new token if cant redirect /login
            else
                clearAll()
        } else if (res === 403) {
            //force to /login
            clearAll()
        } else {
            dispatch({
                type: actionTypes.NEW_MESSAGE_ADDED
            })
        }
    } else
        dispatch({
            type: actionTypes.PROCESS_MESSAGE_ACTION_FAILED
        })
};

export const messagesRequested = async (data, dispatch) => {
    const { conversationId, token, role, userId, skip } = data

    const messageData = {
        skip: skip,
        limit: 10,
        id: conversationId,
        role: role
    }
    let res = await SERVICES.getDetailConversation(messageData, token);
    if (res) {
        if (res === 401) {
            //get new token if cant redirect /login
            let newToken = await refreshToken(userId, token)
            if (newToken) {
                toast.error('Request out of time. Let try again!')
                dispatch({
                    type: actionTypes.UPDATE_TOKEN,
                    token: newToken
                })
            }
            //force to /login
            else
                clearAll()
        } else if (res === 403) {
            //force to /login
            clearAll()
        } else {
            return res.errCode === 0 ? res.data.messages : []
        }
    }
    return []
};

const refreshToken = async (userId, token) => {
    let res = await SERVICES.getToken({
        userId: userId,
        token: token
    })
    if (res && res.token) {
        return res.token;
    } else {
        clearAll()
        return null
    }
}

const clearAll = () => {
    window.localStorage.clear()
    window.location.href = '/login'
}

export const handleChangeLastMessage = (data) => ({
    type: actionTypes.CHANGE_LAST_MESSAGE,
    data: data
})
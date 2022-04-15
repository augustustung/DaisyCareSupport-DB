import axios from './axios'

const userGetAllAdminOnline = (userId, token) => {
    return axios.get(`/api/get-all-channel-online?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).catch(e => {
        return e.response && e.response.status
    })
}

const adminGetAllConversation = (adminId, token) => {
    return axios.get(`/api/get-all-user-inbox?adminId=${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).catch(e => {
        return e.response && e.response.status
    })
}

const getDetailConversation = (data, token) => {
    return axios.post(`/api/get-detail-inbox`, data, {
        headers: { Authorization: `Bearer ${token}` }
    }).catch(e => {
        return e.response && e.response.status
    })
}

const sendMessage = (data) => {
    return axios.post(`/api/send-message`, data, {
        headers: { Authorization: `Bearer ${data.token}` }
    }).catch(e => {
        return e.response && e.response.status
    })
}

const getToken = (data) => {
    return axios.post('/refresh-token', data, {
        headers: { Authorization: `Bearer ${data.token}` }
    }).catch(e => {
        return e.response && e.response.status
    })
}

export {
    userGetAllAdminOnline,
    getDetailConversation,
    sendMessage,
    getToken,
    adminGetAllConversation
}
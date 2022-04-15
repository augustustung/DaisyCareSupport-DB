import actionTypes from "../actions/actionTypes"

const initialState = {
    isUserLoggedIn: !!window.localStorage.getItem('isUserLoggedIn'),
    email: window.localStorage.getItem('email') || '',
    fullName: window.localStorage.getItem('fullName') || '',
    token: window.localStorage.getItem('token') || '',
    userId: window.localStorage.getItem('userId') || '',
    lastActiveAt: window.localStorage.getItem('lastActiveAt') || '',
    userRole: window.localStorage.getItem('userRole') || ''
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            if (action.data) {
                window.localStorage.setItem('isUserLoggedIn', true)
                window.localStorage.setItem('email', action.data.email)
                window.localStorage.setItem('fullName', action.data.fullName)
                window.localStorage.setItem('token', action.data.token)
                window.localStorage.setItem('userId', action.data.userId)
                window.localStorage.setItem('lastActiveAt', action.data.lastActiveAt)
                window.localStorage.setItem('userRole', action.data.userRole)
                return {
                    ...state,
                    email: action.data.email || '',
                    token: action.data.token || '',
                    isUserLoggedIn: true,
                    fullName: action.data.fullName || '',
                    lastActiveAt: action.data.lastActiveAt || '',
                    userId: action.data.userId || '',
                    userRole: action.data.userRole || ''
                }
            }
            return {}
        case actionTypes.UPDATE_TOKEN: {
            window.localStorage.setItem('token', action.token)
            return {
                ...state,
                token: action.token
            }
        }
        case 'USER_RESET': {
            window.localStorage.clear();
            return {
                ...state,
                isUserLoggedIn: false,
                email: '',
                token: '',
                fullName: '',
                lastActiveAt: '',
                userId: '',
                userRole: ''
            }
        }
        default:
            return state;
    }
}

export default userReducer;
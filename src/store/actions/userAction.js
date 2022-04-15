import { SignOutService } from "../../services/userService"

const HandleSignIn = (res) => (dispatch) => {
    dispatch({
        type: "LOGIN_SUCCESS",
        data: {
            email: res.user.email,
            token: res.token,
            fullName: res.user.fullName,
            lastActiveAt: res.user.lastActiveAt,
            userId: res.user._id,
            userRole: res.user.userRole
        }
    })
}

const HandleSignOut = (userId) => {
    return async (dispatch) => {
        dispatch({
            type: 'USER_RESET'
        })
        await SignOutService(userId)

    }
}

export {
    HandleSignIn,
    HandleSignOut
}
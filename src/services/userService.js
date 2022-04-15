import axios from "./axios"

const SignOutService = (userId) => {
    return axios.delete('/sign-out', { data: { userId: userId } })
}

const SignInService = (data) => {
    return axios.post("/sign-in", data)
}

export { SignOutService, SignInService }
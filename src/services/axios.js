import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://daisycare-support-server.herokuapp.com"
});

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        const { data } = response;
        return data;
    }
);

export default instance;
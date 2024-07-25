import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true // Để gửi cookie kèm theo request
});

export default axiosInstance;
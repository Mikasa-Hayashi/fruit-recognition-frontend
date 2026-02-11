import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.API,
})

export default api;
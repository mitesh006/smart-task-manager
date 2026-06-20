import axios from "axios";

const API =  axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default API
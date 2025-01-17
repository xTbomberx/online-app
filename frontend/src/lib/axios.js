// CREATE an INSTANCE we can use without our APP
import axios from 'axios';



export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? 'http://localhost:3000/api' : "/api",   // LOCATION OF MY NODE BACKEND
    withCredentials: true                   // SENDS COOKIES IN EVERY REQUEST
})
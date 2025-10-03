import axios from 'axios';

// Backend API base URL
const BACKEND_API_BASE = process.env.NEXT_PUBLIC_API || 'http://localhost:8080/api';

// Create axios instance for backend API calls
export const backendApi = axios.create({
  baseURL: BACKEND_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor to handle errors
backendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default backendApi;
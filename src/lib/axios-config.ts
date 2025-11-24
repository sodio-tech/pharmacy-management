import { API } from '@/app/utils/constants';
import axios, { AxiosError } from 'axios';
import { store } from '@/store/store';

// Backend API base URL
const BACKEND_API_BASE = `${API}/api`;

// Get access token from Redux state, fallback to localStorage
const getAccessTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    // First, try to get token from Redux state
    const state = store.getState();
    const tokenFromRedux = state.auth?.access_token;
    
    if (tokenFromRedux) {
      return tokenFromRedux;
    }
    
    // Fallback to localStorage if not in Redux state  
    return localStorage.getItem("access_token");
  } catch {
    return null;
  }
};

// Create axios instance for backend API calls
export const backendApi = axios.create({
  baseURL: BACKEND_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
backendApi.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
backendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default backendApi;
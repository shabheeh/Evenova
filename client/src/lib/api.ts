import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      window.location.href = "/login";
    }
    const { data } = error.response;
    const errorMessage =
      data?.error ||
      data?.message ||
      error.message ||
      "An unexpected error occurred";
      
    return Promise.reject(new Error(errorMessage));
  }
);

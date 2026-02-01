import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logs
api.interceptors.request.use(
  (config) => {
    console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log(
      `${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
    );
    return response;
  },
  (error) => {
    console.error(
      `${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`,
    );
    return Promise.reject(error);
  },
);

export default api;

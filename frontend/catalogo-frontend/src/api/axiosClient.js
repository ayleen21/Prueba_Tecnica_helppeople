import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5054/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request 
axiosClient.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response (manejo global de errores)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    
    return Promise.reject(error);
  }
);

export default axiosClient;

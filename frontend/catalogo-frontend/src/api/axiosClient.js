import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5054/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request (puedes agregar auth aquí)
axiosClient.interceptors.request.use(
  (config) => {
    // Ejemplo: agregar token si existe
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response (manejo global de errores)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Puedes manejar errores globales aquí
    // if (error.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);

export default axiosClient;

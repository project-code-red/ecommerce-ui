import axios, { AxiosInstance, AxiosError } from "axios";
import { ApiError } from "@/types/common";

const http: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    // In a real app, you'd get the token from auth store
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      message: error.message || "An error occurred",
    });
  }
);

export default http;


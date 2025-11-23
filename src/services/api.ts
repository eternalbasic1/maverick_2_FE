import axios, { AxiosResponse, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG, STORAGE_KEYS } from "../utils/constants";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("🔧 API_CONFIG.BASE_URL", API_CONFIG.BASE_URL);

// Global logout handler - will be set by AuthContext
let globalLogoutHandler: (() => Promise<void>) | null = null;

export const setLogoutHandler = (handler: () => Promise<void>) => {
  globalLogoutHandler = handler;
};

export const clearLogoutHandler = () => {
  globalLogoutHandler = null;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    console.log("🌐 Making request to:", config.baseURL + config.url);
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    console.log("🔧 token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ Response received:", response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.error("❌ API Error:", error.message);
    console.error("❌ Error URL:", error.config?.url);
    console.error("❌ Error Status:", error.response?.status);
    console.error("❌ Error Data:", error.response?.data);

    const originalRequest = error.config as any;
    const errorData = error.response?.data as any;
    const errorStatus = error.response?.status;

    // Handle token expiration (403 with "Token expired" message)
    if (
      errorStatus === 403 &&
      (errorData?.detail === "Token expired" ||
        errorData?.error === "Token expired" ||
        errorData?.message === "Token expired")
    ) {
      console.log("🔒 Token expired detected - logging out user");

      // Clear tokens immediately
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      // Call global logout handler if available
      if (globalLogoutHandler) {
        try {
          await globalLogoutHandler();
        } catch (logoutError) {
          console.error("❌ Error during automatic logout:", logoutError);
        }
      }

      // Return a rejected promise to prevent the original request from continuing
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - try to refresh token
    if (errorStatus === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN
        );
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.USER_DATA,
        ]);

        // Call global logout handler if available
        if (globalLogoutHandler) {
          try {
            await globalLogoutHandler();
          } catch (logoutError) {
            console.error("❌ Error during automatic logout:", logoutError);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

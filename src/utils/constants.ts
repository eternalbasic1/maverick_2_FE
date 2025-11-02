// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.6:8000/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: "MilkSeller App",
  VERSION: "1.0.0",
  SUPPORTED_LANGUAGES: ["en", "hi"],
  DEFAULT_LANGUAGE: "en",
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyDXpu2QF0oLoX9z_Sm5Ymow8VmoqMqlFqA",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "chitledger.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "chitledger",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "chitledger.firebasestorage.app",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "317441032251",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    "1:317441032251:web:f76fbd9eea17070da91c1e",
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BT5VPH3SST",
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  LANGUAGE: "language",
};

// Skip Request Reasons
export const SKIP_REASONS = [
  { value: "traveling", label: "Traveling" },
  { value: "excess_stock", label: "Excess Stock" },
  { value: "health", label: "Health Issues" },
  { value: "other", label: "Other" },
] as const;

// Delivery Status Options
export const DELIVERY_STATUS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "skipped", label: "Skipped" },
] as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM DD, YYYY",
  API: "YYYY-MM-DD",
  TIME: "HH:mm",
  DATETIME: "MMM DD, YYYY HH:mm",
};

// Validation Rules
export const VALIDATION_RULES = {
  PHONE_NUMBER: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    PATTERN: /^[+]?[\d\s\-\(\)]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  DAILY_LITERS: {
    MIN: 0.5,
    MAX: 10.0,
    STEP: 0.5,
  },
};

// Cutoff Times
export const CUTOFF_TIMES = {
  SKIP_REQUEST: "18:00", // 6 PM
  DELIVERY_UPDATE: "20:00", // 8 PM
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "Requested resource not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  SIGNUP_SUCCESS: "Account created successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  SUBSCRIPTION_CREATED: "Subscription created successfully!",
  RATE_UPDATED: "Rate updated successfully!",
  SKIP_REQUEST_CREATED: "Skip request created successfully!",
  SKIP_REQUEST_CANCELLED: "Skip request cancelled successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  DELIVERY_UPDATED: "Delivery status updated successfully!",
};

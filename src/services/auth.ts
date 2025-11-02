import api from "./api";
import {
  User,
  AuthTokens,
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  LoginWithOTPFormData,
  SignupWithOTPFormData,
  ForgotPasswordWithOTPFormData,
} from "../types/api";

export const authService = {
  // Signup with Firebase ID token
  signup: async (data: {
    phone_number: string;
    full_name: string;
    firebase_id_token: string;
  }): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post("/auth/signup/", data);
    return response.data;
  },

  // Login with Firebase ID token
  login: async (data: {
    phone_number: string;
    firebase_id_token: string;
  }): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post("/auth/login/", data);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post("/auth/refresh/", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Logout (invalidate tokens)
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post("/auth/logout/");
    return response.data;
  },
};

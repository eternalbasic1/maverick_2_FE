import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  AuthTokens,
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
} from "../types/api";
import { authService } from "../services/auth";
import { firebaseAuthService } from "../services/firebaseAuth";
import { STORAGE_KEYS } from "../utils/constants";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isAuthenticated = !!user;

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const [accessToken, userData] = await AsyncStorage.multiGet([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      if (accessToken[1] && userData[1]) {
        setUser(JSON.parse(userData[1]));
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
    setUser(null);
  };

  const storeTokens = async (data: {
    access_token: string;
    refresh_token: string;
    user: User;
  }) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, data.access_token],
      [STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token],
      [STORAGE_KEYS.USER_DATA, JSON.stringify(data.user)],
    ]);
    setUser(data.user);
  };

  // Phone number verification with Firebase
  const verifyPhoneNumber = async (phoneNumber: string) => {
    try {
      const result = await firebaseAuthService.verifyPhoneNumber(phoneNumber);
      return { success: true, confirmation: result.confirmation };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Confirm OTP and get Firebase token
  const confirmOTP = async (confirmation: any, otpCode: string) => {
    try {
      const result = await firebaseAuthService.confirmOTP(
        confirmation,
        otpCode
      );
      return { success: true, firebaseIdToken: result.firebaseIdToken };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Signup with Firebase
  const signup = async (data: {
    phone_number: string;
    full_name: string;
    firebase_id_token: string;
  }) => {
    try {
      setSignupLoading(true);
      const result = await authService.signup(data);
      await storeTokens(result);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    } finally {
      setSignupLoading(false);
    }
  };

  // Login with Firebase
  const login = async (data: {
    phone_number: string;
    firebase_id_token: string;
  }) => {
    try {
      setLoginLoading(true);
      const result = await authService.login(data);
      await storeTokens(result);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLogoutLoading(true);
      await authService.logout();
      await firebaseAuthService.signOut();
      await clearAuthData();
      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      // Clear local data even if server logout fails
      await clearAuthData();
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    } finally {
      setLogoutLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN
      );

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const result = await authService.refreshToken(refreshToken);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.access);

      return { success: true, access_token: result.access };
    } catch (error: any) {
      console.error("Token refresh error:", error);
      await clearAuthData();
      return {
        success: false,
        error: error.response?.data?.message || "Token refresh failed",
      };
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    verifyPhoneNumber,
    confirmOTP,
    refreshToken,
    updateUser,
    loginLoading,
    signupLoading,
    logoutLoading,
  };
};

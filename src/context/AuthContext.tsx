import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { User } from "../types/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<any>;
  signup: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (data: any) => Promise<any>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<any>;
  resendOTP: (phoneNumber: string) => Promise<any>;
  updateUser: (userData: User) => void;
  loginLoading: boolean;
  signupLoading: boolean;
  logoutLoading: boolean;
  forgotPasswordLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

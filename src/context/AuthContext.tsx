import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { User } from "../types/api";
import { setLogoutHandler, clearLogoutHandler } from "../services/api";

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
  const logoutRef = useRef(auth.logout);

  // Keep logout function reference up to date
  useEffect(() => {
    logoutRef.current = auth.logout;
  }, [auth.logout]);

  // Register logout handler with API service for automatic token expiration handling
  useEffect(() => {
    const handleLogout = async () => {
      await logoutRef.current();
    };

    setLogoutHandler(handleLogout);

    // Cleanup on unmount
    return () => {
      clearLogoutHandler();
    };
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

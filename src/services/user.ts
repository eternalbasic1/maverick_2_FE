import api from "./api";
import { User } from "../types/api";

export const userService = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get("/user/me/");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: {
    full_name?: string;
    timezone?: string;
  }): Promise<User> => {
    const response = await api.put("/user/me/", data);
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{ message: string }> => {
    const response = await api.post("/user/change-password/", data);
    return response.data;
  },

  // Delete account
  deleteAccount: async (): Promise<{ message: string }> => {
    const response = await api.delete("/user/me/");
    return response.data;
  },
};

import api from "./api";
import {
  DeliverySchedule,
  AdminSkipRequest,
  BillingReport,
  UpdateDeliveryStatusData,
} from "../types/api";

export const adminService = {
  // Get delivery schedule
  getDeliverySchedule: async (date: string): Promise<DeliverySchedule> => {
    const response = await api.get(`/admin/schedule/?date=${date}`);
    return response.data;
  },

  // Get all skip requests
  getAllSkipRequests: async (
    startDate: string,
    endDate: string
  ): Promise<AdminSkipRequest[]> => {
    const response = await api.get(
      `/admin/skip-requests/?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  },

  // Update delivery status
  updateDeliveryStatus: async (
    data: UpdateDeliveryStatusData
  ): Promise<{
    message: string;
    delivery_date: string;
  }> => {
    const response = await api.put("/admin/update-deliveries/", data);
    return response.data;
  },

  // Get billing report
  getBillingReport: async (
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<BillingReport> => {
    const response = await api.get(
      `/admin/billing-report/?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  },

  // Get all users
  getAllUsers: async (): Promise<any[]> => {
    const response = await api.get("/admin/users/");
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId: string): Promise<any> => {
    const response = await api.get(`/admin/users/${userId}/`);
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async (
    date?: string
  ): Promise<{
    total_deliveries: number;
    total_liters: number;
    delivered_count: number;
    failed_count: number;
    skipped_count: number;
  }> => {
    const response = await api.get(
      `/admin/dashboard/?date=${date || new Date().toISOString().split("T")[0]}`
    );
    return response.data;
  },

  // Get monthly report
  getMonthlyReport: async (
    month: string,
    year: string
  ): Promise<{
    month: string;
    year: string;
    total_deliveries: number;
    total_liters: number;
    success_rate: number;
    revenue: number;
  }> => {
    const response = await api.get(
      `/admin/monthly-report/?month=${month}&year=${year}`
    );
    return response.data;
  },
};

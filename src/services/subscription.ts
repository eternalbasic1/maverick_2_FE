import api from "./api";
import {
  Subscription,
  BillingHistory,
  CreateSubscriptionData,
  UpdateRateData,
} from "../types/api";

export const subscriptionService = {
  // Get current subscription
  getSubscription: async (): Promise<Subscription> => {
    const response = await api.get("/subscription/");
    return response.data;
  },

  // Create new subscription
  createSubscription: async (
    data: CreateSubscriptionData
  ): Promise<{
    message: string;
    subscription: Subscription;
    initial_rate: any;
  }> => {
    const response = await api.post("/subscription/", data);
    return response.data;
  },

  // Update subscription rate
  updateRate: async (
    data: UpdateRateData
  ): Promise<{
    message: string;
    new_rate: any;
    effective_from: string;
  }> => {
    const response = await api.post("/subscription/update-rate/", data);
    return response.data;
  },

  // Get billing history
  getBillingHistory: async (
    startDate: string,
    endDate: string
  ): Promise<BillingHistory> => {
    const response = await api.get(
      `/subscription/billing-history/?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<{ message: string }> => {
    const response = await api.post("/subscription/cancel/");
    return response.data;
  },

  // Reactivate subscription
  reactivateSubscription: async (): Promise<{ message: string }> => {
    const response = await api.post("/subscription/reactivate/");
    return response.data;
  },
};

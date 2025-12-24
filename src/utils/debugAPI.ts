import api from "../services/api";
import { subscriptionService } from "../services/subscription";

// src/utils/debugAPI.ts
export const debugAPI = {
  testAllEndpoints: async () => {
    const endpoints = [
      "/health/",
      "/auth/login/",
      "/subscription/",
      "/admin/schedule/",
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 Testing: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ ${endpoint}:`, response.status, response.data);
      } catch (error: any) {
        console.log(
          `❌ ${endpoint}:`,
          error.response?.status,
          error.response?.data
        );
      }
    }
  },

  testSubscriptionFlow: async () => {
    try {
      // Test subscription creation and retrieval
      const subscription = await subscriptionService.getSubscription();
      console.log("🔍 Subscription test:", subscription);
    } catch (error) {
      console.error("❌ Subscription test failed:", error);
    }
  },
};

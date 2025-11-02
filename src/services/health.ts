import api from "./api";

export const healthService = {
  // Check API health
  checkHealth: async (): Promise<{
    status: "healthy" | "unhealthy";
    timestamp: string;
    version: string;
  }> => {
    try {
      console.log("🔍 Health check: Making request to /health/");
      const response = await api.get("/health/");
      console.log("✅ Health check response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Health check failed:", error.message);
      console.error("❌ Full error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      };
    }
  },

  // Check database connectivity
  checkDatabase: async (): Promise<{
    status: "connected" | "disconnected";
    response_time: number;
  }> => {
    try {
      const startTime = Date.now();
      const response = await api.get("/health/database/");
      const responseTime = Date.now() - startTime;

      return {
        status: "connected",
        response_time: responseTime,
      };
    } catch (error) {
      return {
        status: "disconnected",
        response_time: 0,
      };
    }
  },

  // Check external services
  checkExternalServices: async (): Promise<{
    firebase: "up" | "down";
    sms_service: "up" | "down";
    email_service: "up" | "down";
  }> => {
    try {
      const response = await api.get("/health/external/");
      return response.data;
    } catch (error) {
      return {
        firebase: "down",
        sms_service: "down",
        email_service: "down",
      };
    }
  },
};

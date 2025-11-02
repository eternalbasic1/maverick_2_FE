import { useState, useEffect } from "react";
import { healthService } from "../services/health";

export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(true); // Default to healthy
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      setIsLoading(true);
      const healthStatus = await healthService.checkHealth();
      const isHealthyStatus = healthStatus.status === "healthy";
      setIsHealthy(isHealthyStatus);
      setLastChecked(new Date());
    } catch (error) {
      console.error("Health check failed:", error);
      // Don't block the app on health check failure
      setIsHealthy(true);
      setLastChecked(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check health in background, don't block app
    const timer = setTimeout(() => {
      checkHealth();
    }, 2000); // Check after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const retryHealthCheck = () => {
    checkHealth();
  };

  return {
    isHealthy,
    isLoading,
    lastChecked,
    retryHealthCheck,
  };
};

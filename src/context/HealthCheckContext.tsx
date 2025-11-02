import React, { createContext, useContext, ReactNode } from "react";
import { useHealthCheck } from "../hooks/useHealthCheck";

interface HealthCheckContextType {
  isHealthy: boolean | null;
  isLoading: boolean;
  lastChecked: Date | null;
  retryHealthCheck: () => void;
}

const HealthCheckContext = createContext<HealthCheckContextType | undefined>(
  undefined
);

export const HealthCheckProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const healthCheck = useHealthCheck();
  return (
    <HealthCheckContext.Provider value={healthCheck}>
      {children}
    </HealthCheckContext.Provider>
  );
};

export const useHealthCheckContext = () => {
  const context = useContext(HealthCheckContext);
  if (context === undefined) {
    throw new Error(
      "useHealthCheckContext must be used within a HealthCheckProvider"
    );
  }
  return context;
};

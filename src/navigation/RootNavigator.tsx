import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { AuthNavigator } from "./AuthNavigator";
import { CustomerNavigator } from "./CustomerNavigator";
import { AdminNavigator } from "./AdminNavigator";
import { HealthCheckScreen } from "../screens/HealthCheckScreen";
import { useAuthContext } from "../context/AuthContext";
import { useHealthCheckContext } from "../context/HealthCheckContext";

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const { isHealthy, isLoading: healthLoading } = useHealthCheckContext();

  // Show loading spinner while initializing
  if (isLoading) {
    return <LoadingSpinner message="Initializing app..." />;
  }

  // Show health check only if explicitly unhealthy, but don't block the app
  if (isHealthy === false) {
    return <HealthCheckScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        user?.role === "admin" ? (
          <AdminNavigator />
        ) : (
          <CustomerNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

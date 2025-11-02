import React from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { HealthCheckProvider } from "./src/context/HealthCheckContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { COLORS } from "./src/theme/colors";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <HealthCheckProvider>
            <AuthProvider>
              <StatusBar style="auto" backgroundColor={COLORS.background} />
              <RootNavigator />
            </AuthProvider>
          </HealthCheckProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

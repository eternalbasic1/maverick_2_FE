import React from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { useAuthContext } from "../context/AuthContext";
import { useHealthCheckContext } from "../context/HealthCheckContext";

export const DebugScreen: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const { isHealthy, isLoading: healthLoading } = useHealthCheckContext();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug Information</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Status</Text>
        <Text style={styles.info}>
          Is Authenticated: {isAuthenticated ? "Yes" : "No"}
        </Text>
        <Text style={styles.info}>Is Loading: {isLoading ? "Yes" : "No"}</Text>
        <Text style={styles.info}>
          User: {user ? JSON.stringify(user, null, 2) : "No user"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Check Status</Text>
        <Text style={styles.info}>Is Healthy: {isHealthy ? "Yes" : "No"}</Text>
        <Text style={styles.info}>
          Health Loading: {healthLoading ? "Yes" : "No"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation</Text>
        <Text style={styles.info}>
          Current Navigator:{" "}
          {isAuthenticated
            ? user?.role === "admin"
              ? "AdminNavigator"
              : "CustomerNavigator"
            : "AuthNavigator"}
        </Text>
        <Text style={styles.info}>
          Should show Profile tab:{" "}
          {isAuthenticated && user?.role !== "admin" ? "Yes" : "No"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
});


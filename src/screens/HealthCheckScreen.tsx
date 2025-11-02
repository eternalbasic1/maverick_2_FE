import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../components/glassmorphism/GlassCard";
import { GlassButton } from "../components/glassmorphism/GlassButton";
import { useHealthCheckContext } from "../context/HealthCheckContext";
import { COLORS, TYPOGRAPHY, SPACING } from "../theme/colors";

export const HealthCheckScreen: React.FC = () => {
  const { isHealthy, isLoading, lastChecked, retryHealthCheck } =
    useHealthCheckContext();

  useEffect(() => {
    if (isHealthy === false) {
      // Auto-retry after 5 seconds
      const timer = setTimeout(() => {
        retryHealthCheck();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isHealthy, retryHealthCheck]);

  const getStatusIcon = () => {
    if (isLoading) return "hourglass-outline";
    if (isHealthy === true) return "checkmark-circle";
    return "alert-circle";
  };

  const getStatusColor = () => {
    if (isLoading) return COLORS.warning;
    if (isHealthy === true) return COLORS.success;
    return COLORS.error;
  };

  const getStatusText = () => {
    if (isLoading) return "Checking system health...";
    if (isHealthy === true) return "System is healthy";
    return "System is experiencing issues";
  };

  const getStatusDescription = () => {
    if (isLoading) return "Please wait while we verify the system status.";
    if (isHealthy === true)
      return "All systems are operational. You can proceed.";
    return "We're experiencing technical difficulties. Please try again in a few moments.";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>MilkSeller App</Text>
          <Text style={styles.subtitle}>System Health Check</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={getStatusIcon()}
                size={80}
                color={getStatusColor()}
              />
            </View>

            <Text style={styles.title}>{getStatusText()}</Text>
            <Text style={styles.description}>{getStatusDescription()}</Text>

            {lastChecked && (
              <Text style={styles.lastChecked}>
                Last checked: {lastChecked.toLocaleTimeString()}
              </Text>
            )}
          </View>
        </GlassCard>

        {isHealthy === false && (
          <View style={styles.buttonContainer}>
            <GlassButton
              title="Retry Connection"
              onPress={retryHealthCheck}
              style={styles.retryButton}
              size="large"
            />
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            If the problem persists, please contact support
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
  },
  appTitle: {
    ...TYPOGRAPHY.displaySmall,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: SPACING.xl,
  },
  content: {
    alignItems: "center",
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.headlineMedium,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  lastChecked: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: SPACING.xl,
  },
  retryButton: {
    width: "100%",
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  footerText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    textAlign: "center",
  },
});

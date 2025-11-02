import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { useAuthContext } from "../../context/AuthContext";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const HomeScreen: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.full_name}!</Text>
        <Text style={styles.subtitle}>Here's your milk delivery overview</Text>
      </View>

      <GlassCard style={styles.quickStatsCard}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="water" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>2.5L</Text>
            <Text style={styles.statLabel}>Daily</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.success}
            />
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.upcomingCard}>
        <Text style={styles.cardTitle}>Upcoming Delivery</Text>
        <View style={styles.deliveryInfo}>
          <Ionicons name="time" size={20} color={COLORS.textSecondary} />
          <Text style={styles.deliveryText}>Tomorrow at 7:00 AM</Text>
        </View>
        <View style={styles.deliveryInfo}>
          <Ionicons name="water" size={20} color={COLORS.primary} />
          <Text style={styles.deliveryText}>2.5 Liters</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <View style={styles.actionButton}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.actionText}>Skip Delivery</Text>
          </View>
          <View style={styles.actionButton}>
            <Ionicons
              name="receipt-outline"
              size={24}
              color={COLORS.secondary}
            />
            <Text style={styles.actionText}>View Bill</Text>
          </View>
          <View style={styles.actionButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.accent} />
            <Text style={styles.actionText}>Settings</Text>
          </View>
        </View>
      </GlassCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.headlineLarge,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  quickStatsCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  upcomingCard: {
    marginBottom: SPACING.lg,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  deliveryText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  actionsCard: {
    marginBottom: SPACING.lg,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    padding: SPACING.md,
  },
  actionText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.text,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
});

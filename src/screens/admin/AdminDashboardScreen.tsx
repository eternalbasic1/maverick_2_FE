import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const AdminDashboardScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Today's delivery overview</Text>
      </View>

      <GlassCard style={styles.statsCard}>
        <Text style={styles.cardTitle}>Today's Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="water" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>125</Text>
            <Text style={styles.statLabel}>Total Liters</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>50</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.success}
            />
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle" size={24} color={COLORS.error} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.pendingCard}>
        <Text style={styles.cardTitle}>Pending Actions</Text>
        <View style={styles.pendingItem}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.warning} />
          <Text style={styles.pendingText}>3 Skip Requests Pending</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.textTertiary}
          />
        </View>
        <View style={styles.pendingItem}>
          <Ionicons name="time-outline" size={20} color={COLORS.info} />
          <Text style={styles.pendingText}>5 Deliveries In Progress</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.textTertiary}
          />
        </View>
        <View style={styles.pendingItem}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={COLORS.error}
          />
          <Text style={styles.pendingText}>2 Failed Deliveries</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.textTertiary}
          />
        </View>
      </GlassCard>

      <GlassCard style={styles.recentCard}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="checkmark" size={16} color={COLORS.success} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              Delivery completed for John Doe
            </Text>
            <Text style={styles.activityTime}>2 minutes ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="calendar" size={16} color={COLORS.warning} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              Skip request from Jane Smith
            </Text>
            <Text style={styles.activityTime}>15 minutes ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="close" size={16} color={COLORS.error} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              Delivery failed for Mike Johnson
            </Text>
            <Text style={styles.activityTime}>1 hour ago</Text>
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
  title: {
    ...TYPOGRAPHY.headlineLarge,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  statsCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  statValue: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  pendingCard: {
    marginBottom: SPACING.lg,
  },
  pendingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  pendingText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    marginLeft: SPACING.md,
    flex: 1,
  },
  recentCard: {
    marginBottom: SPACING.lg,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
  },
  activityTime: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

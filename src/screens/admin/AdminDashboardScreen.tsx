import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { adminService } from "../../services/admin";
import { DeliverySchedule } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatDate, formatLiters } from "../../utils/formatting";

export const AdminDashboardScreen: React.FC = () => {
  const [schedule, setSchedule] = useState<DeliverySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTodaySchedule = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const scheduleData = await adminService.getDeliverySchedule(today);
      setSchedule(scheduleData);
    } catch (error: any) {
      console.error("Error loading schedule:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTodaySchedule();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTodaySchedule();
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const deliveredCount =
    schedule?.deliveries.filter((d) => d.status === "delivered").length || 0;
  const failedCount =
    schedule?.deliveries.filter((d) => d.status === "failed").length || 0;
  const scheduledCount =
    schedule?.deliveries.filter((d) => d.status === "scheduled").length || 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          Today's delivery overview - {formatDate(new Date(), "MMMM dd, yyyy")}
        </Text>
      </View>

      <GlassCard style={styles.statsCard}>
        <Text style={styles.cardTitle}>Today's Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="water" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>
              {schedule ? formatLiters(schedule.total_liters) : "0 L"}
            </Text>
            <Text style={styles.statLabel}>Total Liters</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>
              {schedule?.total_deliveries || 0}
            </Text>
            <Text style={styles.statLabel}>Total Deliveries</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.success}
            />
            <Text style={styles.statValue}>{deliveredCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle" size={24} color={COLORS.error} />
            <Text style={styles.statValue}>{failedCount}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
        </View>
      </GlassCard>

      {/* <GlassCard style={styles.pendingCard}>
        <Text style={styles.cardTitle}>Delivery Status</Text>
        <View style={styles.pendingItem}>
          <Ionicons name="time-outline" size={20} color={COLORS.warning} />
          <Text style={styles.pendingText}>
            {scheduledCount} Deliveries Scheduled
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.textTertiary}
          />
        </View>
        <View style={styles.pendingItem}>
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={COLORS.success}
          />
          <Text style={styles.pendingText}>
            {deliveredCount} Deliveries Completed
          </Text>
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
          <Text style={styles.pendingText}>
            {failedCount} Failed Deliveries
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.textTertiary}
          />
        </View>
      </GlassCard> */}

      {schedule && schedule.deliveries.length > 0 && (
        <GlassCard style={styles.recentCard}>
          <Text style={styles.cardTitle}>Recent Deliveries</Text>
          {schedule.deliveries.slice(0, 5).map((delivery, index) => (
            <View key={delivery.user_id + index} style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor:
                      delivery.status === "delivered"
                        ? COLORS.success + "20"
                        : delivery.status === "failed"
                        ? COLORS.error + "20"
                        : COLORS.warning + "20",
                  },
                ]}
              >
                <Ionicons
                  name={
                    delivery.status === "delivered"
                      ? "checkmark"
                      : delivery.status === "failed"
                      ? "close"
                      : "time"
                  }
                  size={16}
                  color={
                    delivery.status === "delivered"
                      ? COLORS.success
                      : delivery.status === "failed"
                      ? COLORS.error
                      : COLORS.warning
                  }
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  {delivery.user_name} -{" "}
                  {formatLiters(delivery.scheduled_liters)}
                </Text>
                <Text style={styles.activityTime}>
                  Status: {delivery.status}
                </Text>
                {delivery.reason && (
                  <View style={styles.reasonContainer}>
                    <Ionicons
                      name="information-circle-outline"
                      size={12}
                      color={COLORS.textSecondary}
                      style={styles.reasonIcon}
                    />
                    <Text style={styles.reasonText} numberOfLines={1}>
                      {delivery.reason}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </GlassCard>
      )}
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
  reasonContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: SPACING.xs,
    padding: SPACING.xs,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 4,
  },
  reasonIcon: {
    marginRight: SPACING.xs,
    marginTop: 1,
  },
  reasonText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    flex: 1,
    fontStyle: "italic",
    fontSize: 11,
  },
});

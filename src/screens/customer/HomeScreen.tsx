import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { useAuthContext } from "../../context/AuthContext";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { subscriptionService } from "../../services/subscription";
import { skipRequestService } from "../../services/skipRequests";
import { Subscription, SkipRequest } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import {
  formatDate,
  formatLiters,
  getCurrentActiveRate,
  getActiveRateForDate,
} from "../../utils/formatting";
import { CustomerTabParamList } from "../../navigation/CustomerNavigator";

type HomeScreenNavigationProp = BottomTabNavigationProp<
  CustomerTabParamList,
  "Home"
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthContext();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [skipRequests, setSkipRequests] = useState<SkipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  console.log("🔍 user", user);
  console.log("🔍 subscription", subscription);

  const loadSubscription = async () => {
    try {
      const sub = await subscriptionService.getSubscription();
      setSubscription(sub);
    } catch (error: any) {
      console.error("Error loading subscription:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load subscription data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadSkipRequests = async () => {
    try {
      // Get skip requests for current month and next month to cover upcoming deliveries
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      // Get next 2 months to ensure we cover all upcoming deliveries
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)
        .toISOString()
        .split("T")[0];

      const requests = await skipRequestService.getSkipRequests(
        startDate,
        endDate
      );
      setSkipRequests(requests);
    } catch (error: any) {
      console.error("Error loading skip requests:", error);
      // Don't show alert for skip requests, just log the error
      // This way the home screen still loads even if skip requests fail
    }
  };

  useEffect(() => {
    loadSubscription();
    loadSkipRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSubscription();
    loadSkipRequests();
  };

  // Calculate the next delivery date excluding skipped dates
  const getNextDeliveryDate = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Create a set of skipped dates for quick lookup
    const skippedDates = new Set(
      skipRequests.map((req) => {
        const date = new Date(req.skip_date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    );

    // Start from tomorrow and find the first date that is not skipped
    let nextDelivery = new Date(tomorrow);
    const maxDaysToCheck = 60; // Check up to 60 days ahead
    let daysChecked = 0;

    while (daysChecked < maxDaysToCheck) {
      const dateTime = nextDelivery.getTime();
      if (!skippedDates.has(dateTime)) {
        // Found a date that is not skipped
        return nextDelivery;
      }
      // Move to next day
      nextDelivery.setDate(nextDelivery.getDate() + 1);
      daysChecked++;
    }

    // If all dates are skipped (unlikely), return tomorrow anyway
    return tomorrow;
  };

  if (loading) {
    return <LoadingSpinner message="Loading subscription..." />;
  }

  // Get current active rate from rate_history based on current date
  const dailyLiters = subscription
    ? getCurrentActiveRate(
        subscription.rate_history || [],
        subscription.current_rate
      )
    : "0";
  const subscriptionDays = subscription
    ? Math.floor(
        (new Date().getTime() -
          new Date(subscription.subscription_start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // Calculate upcoming delivery date (excluding skipped dates)
  const nextDeliveryDate = getNextDeliveryDate();
  const upcomingDeliveryDate = formatDate(nextDeliveryDate, "EEEE, MMMM dd");

  // Get the rate that will be active on the upcoming delivery date
  const upcomingDeliveryLiters = subscription
    ? getActiveRateForDate(
        subscription.rate_history || [],
        nextDeliveryDate,
        subscription.current_rate
      )
    : "0";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.full_name}!</Text>
        <Text style={styles.subtitle}>Here's your milk delivery overview</Text>
      </View>

      {!subscription ? (
        <GlassCard style={styles.noSubscriptionCard}>
          <EmptyState
            icon="water-outline"
            title="No Active Subscription"
            description="Create a subscription to start receiving milk deliveries"
          />
        </GlassCard>
      ) : (
        <>
          <GlassCard style={styles.quickStatsCard}>
            <Text style={styles.cardTitle}>Quick Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="water" size={24} color={COLORS.primary} />
                <Text style={styles.statValue}>
                  {formatLiters(dailyLiters)}
                </Text>
                <Text style={styles.statLabel}>Daily</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={24} color={COLORS.secondary} />
                <Text style={styles.statValue}>{subscriptionDays}</Text>
                <Text style={styles.statLabel}>Days</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  name={
                    subscription.is_active ? "checkmark-circle" : "pause-circle"
                  }
                  size={24}
                  color={
                    subscription.is_active ? COLORS.success : COLORS.warning
                  }
                />
                <Text style={styles.statValue}>
                  {subscription.is_active ? "Active" : "Paused"}
                </Text>
                <Text style={styles.statLabel}>Status</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.upcomingCard}>
            <Text style={styles.cardTitle}>Upcoming Delivery</Text>
            <View style={styles.deliveryInfo}>
              <Ionicons name="time" size={20} color={COLORS.textSecondary} />
              <Text style={styles.deliveryText}>
                {upcomingDeliveryDate} at 7:00 AM
              </Text>
            </View>
            <View style={styles.deliveryInfo}>
              <Ionicons name="water" size={20} color={COLORS.primary} />
              <Text style={styles.deliveryText}>
                {formatLiters(upcomingDeliveryLiters)}
              </Text>
            </View>
            {subscription.subscription_start_date && (
              <View style={styles.deliveryInfo}>
                <Ionicons name="calendar" size={20} color={COLORS.secondary} />
                <Text style={styles.deliveryText}>
                  Started: {formatDate(subscription.subscription_start_date)}
                </Text>
              </View>
            )}
          </GlassCard>
        </>
      )}

      <GlassCard style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("SkipRequest")}
          >
            <Ionicons
              name="calendar-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.actionText}>Skip Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Billing")}
          >
            <Ionicons
              name="receipt-outline"
              size={24}
              color={COLORS.secondary}
            />
            <Text style={styles.actionText}>View Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.accent} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
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
    paddingBottom: SPACING.xl + 80, // Extra padding for tab bar
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
  noSubscriptionCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
  },
});

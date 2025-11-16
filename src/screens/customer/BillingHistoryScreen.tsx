import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { subscriptionService } from "../../services/subscription";
import { BillingHistory } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate, formatLiters } from "../../utils/formatting";

export const BillingHistoryScreen: React.FC = () => {
  const [billingHistory, setBillingHistory] = useState<BillingHistory | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const loadBillingHistory = async () => {
    try {
      const history = await subscriptionService.getBillingHistory(
        startDate,
        endDate
      );
      setBillingHistory(history);
    } catch (error: any) {
      console.error("Error loading billing history:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load billing history"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBillingHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBillingHistory();
  };

  const handleDateRangeChange = () => {
    setShowDateRangeModal(false);
    setLoading(true);
    loadBillingHistory();
  };

  if (loading) {
    return <LoadingSpinner message="Loading billing history..." />;
  }

  if (!billingHistory) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="receipt-outline"
          title="No Billing History"
          description="No billing history found for the selected period"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <GlassCard style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.cardTitle}>Billing Summary</Text>
          <GlassButton
            title="Change Date Range"
            onPress={() => setShowDateRangeModal(true)}
            variant="outline"
            style={styles.dateRangeButton}
          />
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Period:</Text>
          <Text style={styles.summaryValue}>
            {formatDate(billingHistory.billing_period.start_date)} -{" "}
            {formatDate(billingHistory.billing_period.end_date)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Days Delivered:</Text>
          <Text style={styles.summaryValue}>
            {billingHistory.total_days_delivered} days
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Liters:</Text>
          <Text style={styles.summaryValue}>
            {formatLiters(billingHistory.total_liters_delivered)}
          </Text>
        </View>
      </GlassCard>

      {billingHistory.rate_breakdown &&
      billingHistory.rate_breakdown.length > 0 ? (
        <GlassCard style={styles.breakdownCard}>
          <Text style={styles.cardTitle}>Rate Breakdown</Text>
          {billingHistory.rate_breakdown.map((breakdown, index) => (
            <View key={breakdown.rate_id || index} style={styles.breakdownItem}>
              <View style={styles.breakdownInfo}>
                <Text style={styles.breakdownRate}>
                  {formatLiters(breakdown.daily_liters)}/day
                </Text>
                <Text style={styles.breakdownPeriod}>
                  {formatDate(breakdown.effective_from)} -{" "}
                  {breakdown.effective_to
                    ? formatDate(breakdown.effective_to)
                    : "Present"}{" "}
                  ({breakdown.days_delivered || 0} days)
                </Text>
              </View>
              <Text style={styles.breakdownAmount}>
                {formatLiters(breakdown.total_liters || 0)}
              </Text>
            </View>
          ))}
        </GlassCard>
      ) : (
        <GlassCard style={styles.breakdownCard}>
          <Text style={styles.cardTitle}>Rate Breakdown</Text>
          <EmptyState
            icon="analytics-outline"
            title="No Rate Breakdown"
            description="No delivery data available for this period"
          />
        </GlassCard>
      )}

      {/* Date Range Modal */}
      <Modal
        visible={showDateRangeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateRangeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

            <Text style={styles.inputLabel}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />

            <Text style={styles.inputLabel}>End Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
            />

            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowDateRangeModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <GlassButton
                title="Apply"
                onPress={handleDateRangeChange}
                style={styles.modalButton}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
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
  summaryCard: {
    marginBottom: SPACING.lg,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
  },
  dateRangeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  summaryLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  breakdownCard: {
    marginBottom: SPACING.lg,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownRate: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  breakdownPeriod: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  breakdownAmount: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: SPACING.xl,
  },
  modalTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  inputLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: SPACING.md,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
  },
});

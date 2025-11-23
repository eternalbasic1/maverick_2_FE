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
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [startDateObj, setStartDateObj] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [endDateObj, setEndDateObj] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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
        {billingHistory.total_amount !== undefined && (
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={[styles.summaryValue, styles.totalAmount]}>
              ₹{billingHistory.total_amount.toFixed(2)}
            </Text>
          </View>
        )}
      </GlassCard>

      {/* Pricing Details Section */}
      {billingHistory.rate_breakdown &&
      billingHistory.rate_breakdown.length > 0 &&
      billingHistory.rate_breakdown.some((bd) => bd.pricing) ? (
        <GlassCard style={styles.pricingCard}>
          <Text style={styles.cardTitle}>Pricing Details</Text>
          {billingHistory.rate_breakdown.map((breakdown, index) => {
            if (!breakdown.pricing) return null;
            const pricing = breakdown.pricing;
            return (
              <View key={breakdown.rate_id || index} style={styles.pricingItem}>
                <View style={styles.pricingHeader}>
                  <View style={styles.pricingInfo}>
                    <Text style={styles.pricingRate}>
                      {formatLiters(pricing.liters)}/day @ ₹
                      {pricing.price_per_day}/day
                    </Text>
                    <Text style={styles.pricingPeriod}>
                      {formatDate(pricing.pricing_effective_from)} -{" "}
                      {pricing.pricing_effective_to
                        ? formatDate(pricing.pricing_effective_to)
                        : "Present"}
                    </Text>
                  </View>
                  <Text style={styles.pricingAmount}>
                    ₹{pricing.total_amount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.pricingDetails}>
                  <View style={styles.pricingDetailRow}>
                    <Text style={styles.pricingDetailLabel}>Days:</Text>
                    <Text style={styles.pricingDetailValue}>
                      {pricing.days_count} days
                    </Text>
                  </View>
                  <View style={styles.pricingDetailRow}>
                    <Text style={styles.pricingDetailLabel}>Rate:</Text>
                    <Text style={styles.pricingDetailValue}>
                      ₹{pricing.price_per_day}/day
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </GlassCard>
      ) : null}

      {/* Rate Breakdown Section */}
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
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              style={styles.datePickerButton}
            >
              <View style={styles.datePickerContent}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.datePickerIcon}
                />
                <Text style={styles.datePickerText}>
                  {startDate || "Select date"}
                </Text>
              </View>
            </TouchableOpacity>
            {showStartDatePicker && (
              <View style={styles.datePickerContainer}>
                {Platform.OS === "ios" ? (
                  <>
                    <View style={styles.datePickerHeader}>
                      <Text style={styles.datePickerHeaderText}>
                        Select Start Date
                      </Text>
                    </View>
                    <View style={styles.datePickerWrapper}>
                      <DateTimePicker
                        value={startDateObj}
                        mode="date"
                        display="spinner"
                        onChange={handleStartDateChange}
                        maximumDate={endDateObj}
                        textColor={COLORS.text}
                        themeVariant="light"
                        style={styles.datePicker}
                        locale="en_US"
                      />
                    </View>
                    <View style={styles.iosPickerButtons}>
                      <TouchableOpacity
                        onPress={() => setShowStartDatePicker(false)}
                        style={styles.iosPickerButton}
                      >
                        <Text style={styles.iosPickerButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleStartDateDone}
                        style={[
                          styles.iosPickerButton,
                          styles.iosPickerButtonPrimary,
                        ]}
                      >
                        <Text style={styles.iosPickerButtonTextPrimary}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <DateTimePicker
                    value={startDateObj}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                    maximumDate={endDateObj}
                  />
                )}
              </View>
            )}

            <Text style={styles.inputLabel}>End Date</Text>
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              style={styles.datePickerButton}
            >
              <View style={styles.datePickerContent}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.datePickerIcon}
                />
                <Text style={styles.datePickerText}>
                  {endDate || "Select date"}
                </Text>
              </View>
            </TouchableOpacity>
            {showEndDatePicker && (
              <View style={styles.datePickerContainer}>
                {Platform.OS === "ios" ? (
                  <>
                    <View style={styles.datePickerHeader}>
                      <Text style={styles.datePickerHeaderText}>
                        Select End Date
                      </Text>
                    </View>
                    <View style={styles.datePickerWrapper}>
                      <DateTimePicker
                        value={endDateObj}
                        mode="date"
                        display="spinner"
                        onChange={handleEndDateChange}
                        minimumDate={startDateObj}
                        textColor={COLORS.text}
                        themeVariant="light"
                        style={styles.datePicker}
                        locale="en_US"
                      />
                    </View>
                    <View style={styles.iosPickerButtons}>
                      <TouchableOpacity
                        onPress={() => setShowEndDatePicker(false)}
                        style={styles.iosPickerButton}
                      >
                        <Text style={styles.iosPickerButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleEndDateDone}
                        style={[
                          styles.iosPickerButton,
                          styles.iosPickerButtonPrimary,
                        ]}
                      >
                        <Text style={styles.iosPickerButtonTextPrimary}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <DateTimePicker
                    value={endDateObj}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                    minimumDate={startDateObj}
                  />
                )}
              </View>
            )}

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
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  totalAmount: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  pricingCard: {
    marginBottom: SPACING.lg,
  },
  pricingItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  pricingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  pricingInfo: {
    flex: 1,
  },
  pricingRate: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  pricingPeriod: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  pricingAmount: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primary,
    fontWeight: "700",
  },
  pricingDetails: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  pricingDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },
  pricingDetailLabel: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
  },
  pricingDetailValue: {
    ...TYPOGRAPHY.labelSmall,
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
  datePickerButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerIcon: {
    marginRight: SPACING.sm,
  },
  datePickerText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    flex: 1,
  },
  datePickerContainer: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    width: "100%",
  },
  datePickerHeader: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  datePickerHeaderText: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
  },
  datePickerWrapper: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs,
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 180,
    maxHeight: 200,
  },
  datePicker: {
    width: "95%",
    height: 180,
    transform: [{ scale: 0.9 }],
  },
  iosPickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.backgroundSecondary,
  },
  iosPickerButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iosPickerButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  iosPickerButtonText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.text,
    fontWeight: "600",
  },
  iosPickerButtonTextPrimary: {
    ...TYPOGRAPHY.labelLarge,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

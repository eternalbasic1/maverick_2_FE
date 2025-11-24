import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { adminService } from "../../services/admin";
import { BillingReport, User } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import {
  formatDate,
  formatLiters,
  formatPhoneNumberDisplay,
} from "../../utils/formatting";

export const BillingReportScreen: React.FC = () => {
  const [billingReport, setBillingReport] = useState<BillingReport | null>(
    null
  );
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const getMonthStartDate = () => {
    const date = new Date();
    date.setDate(1);
    return date;
  };
  const getTodayDate = () => {
    return new Date();
  };
  const [startDate, setStartDate] = useState(() => {
    return getMonthStartDate().toISOString().split("T")[0];
  });
  const [startDateObj, setStartDateObj] = useState(() => getMonthStartDate());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(() => {
    return getTodayDate().toISOString().split("T")[0];
  });
  const [endDateObj, setEndDateObj] = useState(() => getTodayDate());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);

  const loadCustomers = async () => {
    try {
      const response = await adminService.getAllCustomers();
      setCustomers(response.customers);
    } catch (error: any) {
      console.error("Error loading customers:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load customers"
      );
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadBillingReport = async () => {
    if (!selectedCustomer) {
      Alert.alert("Error", "Please select a customer");
      return;
    }

    try {
      setLoading(true);
      const report = await adminService.getBillingReport(
        selectedCustomer.id,
        startDate,
        endDate
      );
      setBillingReport(report);
    } catch (error: any) {
      console.error("Error loading billing  report:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load billing report"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (!selectedCustomer) return;
    setRefreshing(true);
    loadBillingReport();
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }

    if (selectedDate) {
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      const end = new Date(endDateObj);
      end.setHours(0, 0, 0, 0);

      if (selected > end) {
        Alert.alert(
          "Invalid Date",
          "Start date cannot be after end date. Please select an earlier date."
        );
        return;
      }

      setStartDateObj(selectedDate);
      setStartDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleStartDateDone = () => {
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }

    if (selectedDate) {
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      const start = new Date(startDateObj);
      start.setHours(0, 0, 0, 0);

      if (selected < start) {
        Alert.alert(
          "Invalid Date",
          "End date cannot be before start date. Please select a later date."
        );
        return;
      }

      setEndDateObj(selectedDate);
      setEndDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleEndDateDone = () => {
    setShowEndDatePicker(false);
  };

  const handleApplyFilter = () => {
    setShowFilterModal(false);
    loadBillingReport();
  };

  const handleCustomerSelect = (customer: User) => {
    setSelectedCustomer(customer);
  };

  if (loading && !billingReport) {
    return <LoadingSpinner message="Loading billing report..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <GlassCard style={styles.filterCard}>
        <Text style={styles.cardTitle}>Billing Report</Text>
        <View style={styles.filterActions}>
          <GlassButton
            title="Set Filters"
            onPress={() => setShowFilterModal(true)}
            variant="outline"
            style={styles.filterButton}
          />
        </View>
      </GlassCard>

      {billingReport ? (
        <>
          <GlassCard style={styles.summaryCard}>
            <Text style={styles.cardTitle}>User Information</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Name:</Text>
              <Text style={styles.summaryValue}>{billingReport.user.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phone:</Text>
              <Text style={styles.summaryValue}>
                {billingReport.user.phone}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Period:</Text>
              <Text style={styles.summaryValue}>
                {formatDate(billingReport.billing_period.start_date)} -{" "}
                {formatDate(billingReport.billing_period.end_date)}
              </Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Delivered Days:</Text>
              <Text style={styles.summaryValue}>
                {billingReport.summary.total_delivered_days}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Delivered Liters:</Text>
              <Text style={styles.summaryValue}>
                {formatLiters(billingReport.summary.total_delivered_liters)}
              </Text>
            </View>
            {billingReport.summary.total_amount !== undefined && (
              <View style={[styles.summaryRow, styles.summaryRowLast]}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={[styles.summaryValue, styles.totalAmount]}>
                  ₹{billingReport.summary.total_amount.toFixed(2)}
                </Text>
              </View>
            )}
          </GlassCard>

          {/* Pricing Details Section */}
          {billingReport.rate_breakdown &&
          billingReport.rate_breakdown.length > 0 &&
          billingReport.rate_breakdown.some((bd) => bd.pricing) ? (
            <GlassCard style={styles.pricingCard}>
              <Text style={styles.cardTitle}>Pricing Details</Text>
              {billingReport.rate_breakdown.map((breakdown, index) => {
                if (!breakdown.pricing) return null;
                const pricing = breakdown.pricing;
                return (
                  <View
                    key={breakdown.rate_id || index}
                    style={styles.pricingItem}
                  >
                    <View style={styles.pricingHeader}>
                      <View style={styles.pricingInfo}>
                        <View style={styles.pricingTitleRow}>
                          <Text style={styles.pricingRate}>
                            {formatLiters(pricing.daily_liters)}/day
                          </Text>
                          <View style={styles.milkTypeBadge}>
                            <Text style={styles.milkTypeBadgeText}>
                              {pricing.milk_type === "buffalo"
                                ? "Buffalo"
                                : "Cow"}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.pricingSubtext}>
                          ₹{pricing.price_per_liter}/L × {pricing.daily_liters}L
                          = ₹{pricing.price_per_day}/day
                        </Text>
                        {breakdown.effective_from && (
                          <Text style={styles.pricingPeriod}>
                            {formatDate(breakdown.effective_from)} -{" "}
                            {breakdown.effective_to
                              ? formatDate(breakdown.effective_to)
                              : "Present"}
                          </Text>
                        )}
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
                        <Text style={styles.pricingDetailLabel}>
                          Price/Liter:
                        </Text>
                        <Text style={styles.pricingDetailValue}>
                          ₹{pricing.price_per_liter}
                        </Text>
                      </View>
                      <View style={styles.pricingDetailRow}>
                        <Text style={styles.pricingDetailLabel}>
                          Daily Rate:
                        </Text>
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
          {billingReport.rate_breakdown &&
          billingReport.rate_breakdown.length > 0 ? (
            <GlassCard style={styles.breakdownCard}>
              <Text style={styles.cardTitle}>Rate Breakdown</Text>
              {billingReport.rate_breakdown.map((breakdown, index) => (
                <View
                  key={breakdown.rate_id || index}
                  style={styles.breakdownItem}
                >
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownRate}>
                      {formatLiters(breakdown.daily_liters)}/day
                    </Text>
                    <Text style={styles.breakdownPeriod}>
                      {formatDate(breakdown.effective_from)} -{" "}
                      {breakdown.effective_to
                        ? formatDate(breakdown.effective_to)
                        : "Present"}
                    </Text>
                    <Text style={styles.breakdownDetails}>
                      Expected: {breakdown.expected_delivery_days} days |
                      Actual: {breakdown.actual_delivery_days} days | Success
                      Rate: {breakdown.delivery_success_rate}
                    </Text>
                    <Text style={styles.breakdownDetails}>
                      Delivered: {formatLiters(breakdown.delivered_liters)} (
                      {breakdown.days_delivered || 0} days)
                    </Text>
                    {breakdown.total_liters !== undefined && (
                      <Text style={styles.breakdownDetails}>
                        Total Liters: {formatLiters(breakdown.total_liters)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </GlassCard>
          ) : (
            <GlassCard style={styles.breakdownCard}>
              <EmptyState
                icon="analytics-outline"
                title="No Rate Breakdown"
                description="No delivery data available for this period"
              />
            </GlassCard>
          )}

          {billingReport.deliveries && billingReport.deliveries.length > 0 && (
            <GlassCard style={styles.deliveriesCard}>
              <Text style={styles.cardTitle}>Delivery History</Text>
              {billingReport.deliveries.map((delivery, index) => (
                <View key={delivery.id || index} style={styles.deliveryItem}>
                  <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryDate}>
                      {formatDate(delivery.delivery_date)}
                    </Text>
                    <Text style={styles.deliveryDetails}>
                      Scheduled: {delivery.scheduled_liters}L | Actual:{" "}
                      {delivery.actual_liters}L
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          delivery.status === "delivered"
                            ? COLORS.success + "20"
                            : COLORS.error + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            delivery.status === "delivered"
                              ? COLORS.success
                              : COLORS.error,
                        },
                      ]}
                    >
                      {delivery.status}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>
          )}
        </>
      ) : (
        <GlassCard style={styles.emptyCard}>
          <EmptyState
            icon="receipt-outline"
            title="No Billing Report"
            description="Select a customer and date range to generate billing report"
          />
        </GlassCard>
      )}

      {/* Combined Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Filters</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowFilterModal(false);
                  setShowCustomerList(false);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={false}
            >
              <Text style={styles.inputLabel}>Select Customer</Text>
              <TouchableOpacity
                style={styles.customerDropdown}
                onPress={() => setShowCustomerList(!showCustomerList)}
              >
                <View style={styles.customerDropdownContent}>
                  <Ionicons name="person" size={20} color={COLORS.primary} />
                  <Text style={styles.customerDropdownText}>
                    {selectedCustomer
                      ? `${
                          selectedCustomer.full_name
                        } (${formatPhoneNumberDisplay(
                          selectedCustomer.phone_number
                        )})`
                      : "Select Customer"}
                  </Text>
                  <Ionicons
                    name={showCustomerList ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={COLORS.textSecondary}
                  />
                </View>
              </TouchableOpacity>
              {showCustomerList && (
                <View style={styles.customerListContainer}>
                  <FlatList
                    data={customers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.customerItem,
                          selectedCustomer?.id === item.id &&
                            styles.selectedCustomer,
                        ]}
                        onPress={() => {
                          handleCustomerSelect(item);
                          setShowCustomerList(false);
                        }}
                      >
                        <View style={styles.customerItemContent}>
                          <Text style={styles.customerItemName}>
                            {item.full_name}
                          </Text>
                          <Text style={styles.customerItemPhone}>
                            {formatPhoneNumberDisplay(item.phone_number)}
                          </Text>
                        </View>
                        {selectedCustomer?.id === item.id && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={COLORS.success}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                    style={styles.customerList}
                    nestedScrollEnabled={true}
                    ListEmptyComponent={
                      <View style={styles.emptyList}>
                        <Text style={styles.emptyListText}>
                          No customers found
                        </Text>
                      </View>
                    }
                  />
                </View>
              )}

              <Text style={styles.inputLabel}>Start Date</Text>

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
            </ScrollView>
            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowFilterModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <GlassButton
                title="Apply"
                onPress={handleApplyFilter}
                style={styles.modalButton}
              />
            </View>
          </View>
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
  },
  filterCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  filterActions: {
    gap: SPACING.md,
  },
  customerDropdown: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  customerDropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  customerDropdownText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    flex: 1,
  },
  customerListContainer: {
    maxHeight: 200,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  summaryCard: {
    marginBottom: SPACING.lg,
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
  pricingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  pricingRate: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  milkTypeBadge: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  milkTypeBadgeText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 10,
  },
  pricingSubtext: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
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
    paddingVertical: SPACING.md,
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
  breakdownDetails: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  deliveriesCard: {
    marginBottom: SPACING.lg,
  },
  deliveryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryDate: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  deliveryDetails: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    ...TYPOGRAPHY.labelSmall,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emptyCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalScrollContent: {
    paddingBottom: SPACING.md,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  customerList: {
    maxHeight: 400,
  },
  customerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedCustomer: {
    backgroundColor: COLORS.primary + "10",
    borderColor: COLORS.primary,
  },
  customerItemContent: {
    flex: 1,
  },
  customerItemName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  customerItemPhone: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  emptyList: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyListText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
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

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
} from "react-native";
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
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

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

  const handleApplyFilter = () => {
    setShowFilterModal(false);
    loadBillingReport();
  };

  const handleCustomerSelect = (customer: User) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
    // Automatically load report when customer is selected
    if (startDate && endDate) {
      setTimeout(() => {
        loadBillingReport();
      }, 100);
    }
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
          <TouchableOpacity
            style={styles.customerSelector}
            onPress={() => setShowCustomerModal(true)}
          >
            <Ionicons name="person" size={20} color={COLORS.primary} />
            <Text style={styles.customerSelectorText}>
              {selectedCustomer
                ? `${selectedCustomer.full_name} (${formatPhoneNumberDisplay(
                    selectedCustomer.phone_number
                  )})`
                : "Select Customer"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          <GlassButton
            title="Set Dates"
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
          </GlassCard>

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
                      Delivered: {formatLiters(breakdown.delivered_liters)}
                    </Text>
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

      {/* Customer Selection Modal */}
      <Modal
        visible={showCustomerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Customer</Text>
              <TouchableOpacity
                onPress={() => setShowCustomerModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={customers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.customerItem,
                    selectedCustomer?.id === item.id && styles.selectedCustomer,
                  ]}
                  onPress={() => handleCustomerSelect(item)}
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
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              style={styles.customerList}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>No customers found</Text>
                </View>
              }
            />
          </GlassCard>
        </View>
      </Modal>

      {/* Date Range Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Date Range</Text>

            <Text style={styles.inputLabel}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor={COLORS.textTertiary}
            />

            <Text style={styles.inputLabel}>End Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor={COLORS.textTertiary}
            />

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
  customerSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  customerSelectorText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    flex: 1,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    padding: SPACING.xl,
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
});

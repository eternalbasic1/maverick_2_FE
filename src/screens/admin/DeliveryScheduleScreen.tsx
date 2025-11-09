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
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { adminService } from "../../services/admin";
import { DeliverySchedule, Delivery } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import {
  formatDate,
  formatLiters,
  formatDeliveryStatus,
} from "../../utils/formatting";
import { DELIVERY_STATUS } from "../../utils/constants";

export const DeliveryScheduleScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [schedule, setSchedule] = useState<DeliverySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [deliveryStatus, setDeliveryStatus] = useState<string>("delivered");
  const [actualLiters, setActualLiters] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const scheduleData = await adminService.getDeliverySchedule(selectedDate);
      setSchedule(scheduleData);
    } catch (error: any) {
      console.error("Error loading schedule:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load delivery schedule"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSchedule();
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const openUpdateModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setDeliveryStatus(delivery.status);
    setActualLiters(delivery.scheduled_liters.toString());
    setShowUpdateModal(true);
  };

  const handleUpdateDelivery = async () => {
    if (!selectedDelivery) return;

    setSubmitting(true);
    try {
      await adminService.updateDeliveryStatus({
        delivery_date: selectedDate,
        deliveries: [
          {
            user_id: selectedDelivery.user_id,
            status: deliveryStatus as any,
            actual_liters:
              deliveryStatus === "delivered" ? actualLiters : undefined,
          },
        ],
      });
      Alert.alert("Success", "Delivery status updated successfully!");
      setShowUpdateModal(false);
      setSelectedDelivery(null);
      loadSchedule();
    } catch (error: any) {
      console.error("Error updating delivery:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update delivery status"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickMarkDelivered = async (delivery: Delivery) => {
    Alert.alert(
      "Mark as Delivered",
      `Mark delivery for ${delivery.user_name} as delivered?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Mark Delivered",
          onPress: async () => {
            setSubmitting(true);
            try {
              await adminService.updateDeliveryStatus({
                delivery_date: selectedDate,
                deliveries: [
                  {
                    user_id: delivery.user_id,
                    status: "delivered",
                    actual_liters: delivery.scheduled_liters.toString(),
                  },
                ],
              });
              Alert.alert("Success", "Delivery marked as delivered!");
              loadSchedule();
            } catch (error: any) {
              console.error("Error updating delivery:", error);
              Alert.alert(
                "Error",
                error.response?.data?.error ||
                  "Failed to update delivery status"
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return { name: "checkmark-circle", color: COLORS.success };
      case "failed":
        return { name: "close-circle", color: COLORS.error };
      case "skipped":
        return { name: "remove-circle", color: COLORS.warning };
      default:
        return { name: "time", color: COLORS.warning };
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading delivery schedule..." />;
  }

  const deliveredCount =
    schedule?.deliveries.filter((d) => d.status === "delivered").length || 0;
  const pendingCount =
    schedule?.deliveries.filter((d) => d.status === "scheduled").length || 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <GlassCard style={styles.dateCard}>
        <Text style={styles.cardTitle}>Select Date</Text>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          value={selectedDate}
          onChangeText={handleDateChange}
          placeholderTextColor={COLORS.textTertiary}
        />
      </GlassCard>

      {schedule && (
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Delivery Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Deliveries:</Text>
            <Text style={styles.summaryValue}>{schedule.total_deliveries}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Liters:</Text>
            <Text style={styles.summaryValue}>
              {formatLiters(schedule.total_liters)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completed:</Text>
            <Text style={[styles.summaryValue, styles.completed]}>
              {deliveredCount}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pending:</Text>
            <Text style={[styles.summaryValue, styles.pending]}>
              {pendingCount}
            </Text>
          </View>
        </GlassCard>
      )}

      {schedule && schedule.deliveries.length > 0 ? (
        <GlassCard style={styles.deliveriesCard}>
          <Text style={styles.cardTitle}>Delivery List</Text>
          {schedule.deliveries.map((delivery, index) => {
            const statusIcon = getStatusIcon(delivery.status);
            return (
              <View key={delivery.user_id + index} style={styles.deliveryItem}>
                <TouchableOpacity
                  style={styles.deliveryItemContent}
                  onPress={() => openUpdateModal(delivery)}
                >
                  <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryName}>
                      {delivery.user_name}
                    </Text>
                    <Text style={styles.deliveryPhone}>
                      {delivery.user_phone}
                    </Text>
                    <Text style={styles.deliveryAmount}>
                      Scheduled: {formatLiters(delivery.scheduled_liters)}
                    </Text>
                  </View>
                  <View style={styles.deliveryStatus}>
                    <Ionicons
                      name={statusIcon.name as any}
                      size={20}
                      color={statusIcon.color}
                    />
                    <Text
                      style={[styles.statusText, { color: statusIcon.color }]}
                    >
                      {formatDeliveryStatus(delivery.status)}
                    </Text>
                  </View>
                </TouchableOpacity>
                {delivery.status === "scheduled" && (
                  <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => handleQuickMarkDelivered(delivery)}
                    disabled={submitting}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.success}
                    />
                    <Text style={styles.quickActionText}>Mark Delivered</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </GlassCard>
      ) : (
        <GlassCard style={styles.deliveriesCard}>
          <EmptyState
            icon="calendar-outline"
            title="No Deliveries Scheduled"
            description={`No deliveries scheduled for ${formatDate(
              selectedDate
            )}`}
          />
        </GlassCard>
      )}

      {/* Update Delivery Modal */}
      <Modal
        visible={showUpdateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Delivery Status</Text>

            {selectedDelivery && (
              <>
                <Text style={styles.modalLabel}>Customer:</Text>
                <Text style={styles.modalValue}>
                  {selectedDelivery.user_name}
                </Text>

                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.statusOptions}>
                  {DELIVERY_STATUS.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={[
                        styles.statusOption,
                        deliveryStatus === status.value &&
                          styles.selectedStatusOption,
                      ]}
                      onPress={() => setDeliveryStatus(status.value)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          deliveryStatus === status.value &&
                            styles.selectedStatusOptionText,
                        ]}
                      >
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {deliveryStatus === "delivered" && (
                  <>
                    <Text style={styles.inputLabel}>Actual Liters</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter actual liters delivered"
                      value={actualLiters}
                      onChangeText={setActualLiters}
                      keyboardType="decimal-pad"
                    />
                  </>
                )}

                <View style={styles.modalButtons}>
                  <GlassButton
                    title="Cancel"
                    onPress={() => setShowUpdateModal(false)}
                    variant="outline"
                    style={styles.modalButton}
                  />
                  <GlassButton
                    title={submitting ? "Updating..." : "Update"}
                    onPress={handleUpdateDelivery}
                    disabled={submitting}
                    style={styles.modalButton}
                  />
                </View>
              </>
            )}
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
  dateCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  dateInput: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: SPACING.md,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  completed: {
    color: COLORS.success,
  },
  pending: {
    color: COLORS.warning,
  },
  deliveriesCard: {
    marginBottom: SPACING.lg,
  },
  deliveryItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  deliveryItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  deliveryPhone: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  deliveryAmount: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  deliveryStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  statusText: {
    ...TYPOGRAPHY.labelSmall,
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
  modalLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  modalValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
  inputLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  statusOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
  },
  selectedStatusOption: {
    backgroundColor: COLORS.primary + "10",
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
  },
  selectedStatusOptionText: {
    color: COLORS.primary,
    fontWeight: "600",
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
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.success + "10",
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.success + "30",
    gap: SPACING.xs,
  },
  quickActionText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.success,
    fontWeight: "600",
  },
});

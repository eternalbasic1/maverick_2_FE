import React, { useState, useEffect, useRef } from "react";
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
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

type DeliveryTab = "scheduled" | "delivered" | "undelivered";

export const DeliveryScheduleScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [schedule, setSchedule] = useState<DeliverySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<DeliveryTab>("scheduled");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUndeliveredModal, setShowUndeliveredModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [deliveryStatus, setDeliveryStatus] = useState<string>("delivered");
  const [actualLiters, setActualLiters] = useState<string>("");
  const [deliveryReason, setDeliveryReason] = useState<string>("");
  const [undeliveredReason, setUndeliveredReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const isInitialMount = useRef(true);

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
    // Load schedule on initial mount
    loadSchedule();
  }, []);

  // Sync date object with selected date string when it changes externally
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      if (!isNaN(date.getTime())) {
        setSelectedDateObj(date);
      }
    }
  }, [selectedDate]);

  // Reload schedule when selectedDate changes
  useEffect(() => {
    // Skip initial mount (handled by first useEffect)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Reload schedule when date changes
    if (selectedDate) {
      loadSchedule();
    }
  }, [selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSchedule();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      // On Android, update immediately when date is selected
      if (selectedDate) {
        setSelectedDateObj(selectedDate);
        const dateString = selectedDate.toISOString().split("T")[0];
        setSelectedDate(dateString);
        // Schedule will reload automatically via useEffect when selectedDate changes
      }
      return;
    }

    // On iOS, only update the date object as user scrolls (don't update selectedDate string yet)
    if (selectedDate) {
      setSelectedDateObj(selectedDate);
    }
  };

  const handleDonePress = () => {
    // On iOS, update the selected date string - useEffect will handle reload
    const dateString = selectedDateObj.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setShowDatePicker(false);
    // Schedule will reload automatically via useEffect when selectedDate changes
  };

  const openUpdateModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setDeliveryStatus(delivery.status);
    setActualLiters(delivery.scheduled_liters.toString());
    setDeliveryReason(delivery.reason || "");
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
            reason: deliveryReason.trim() || null,
          },
        ],
      });
      Alert.alert("Success", "Delivery status updated successfully!");
      setShowUpdateModal(false);
      setSelectedDelivery(null);
      setDeliveryReason("");
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
                    reason: null, // No reason for quick mark
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

  const handleQuickMarkUndelivered = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setUndeliveredReason("");
    setShowUndeliveredModal(true);
  };

  const handleMarkUndelivered = async () => {
    if (!selectedDelivery) return;

    if (!undeliveredReason.trim()) {
      Alert.alert(
        "Required",
        "Please provide a reason for marking as undelivered."
      );
      return;
    }

    setSubmitting(true);
    try {
      await adminService.updateDeliveryStatus({
        delivery_date: selectedDate,
        deliveries: [
          {
            user_id: selectedDelivery.user_id,
            status: "failed",
            actual_liters: undefined,
            reason: undeliveredReason.trim(),
          },
        ],
      });
      Alert.alert("Success", "Delivery marked as undelivered!");
      setShowUndeliveredModal(false);
      setUndeliveredReason("");
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

  // Filter deliveries based on active tab
  const getFilteredDeliveries = (): Delivery[] => {
    if (!schedule) return [];

    switch (activeTab) {
      case "scheduled":
        return schedule.deliveries.filter((d) => d.status === "scheduled");
      case "delivered":
        return schedule.deliveries.filter((d) => d.status === "delivered");
      case "undelivered":
        return schedule.deliveries.filter((d) => d.status === "failed");
      default:
        return schedule.deliveries;
    }
  };

  const filteredDeliveries = getFilteredDeliveries();

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
        <TouchableOpacity
          onPress={() => {
            if (!selectedDate) {
              setSelectedDateObj(new Date());
            }
            setShowDatePicker(true);
          }}
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
              {selectedDate
                ? formatDate(selectedDate, "EEEE, MMMM dd, yyyy")
                : "Select date"}
            </Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            {Platform.OS === "ios" ? (
              <>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerHeaderText}>Select Date</Text>
                </View>
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={selectedDateObj}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor={COLORS.text}
                    themeVariant="light"
                    style={styles.datePicker}
                    locale="en_US"
                  />
                </View>
                <View style={styles.iosPickerButtons}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.iosPickerButton}
                  >
                    <Text style={styles.iosPickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDonePress}
                    style={[
                      styles.iosPickerButton,
                      styles.iosPickerButtonPrimary,
                    ]}
                  >
                    <Text style={styles.iosPickerButtonTextPrimary}>Done</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <DateTimePicker
                value={selectedDateObj}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        )}
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

      {/* Tab Switcher */}
      {schedule && schedule.deliveries.length > 0 && (
        <GlassCard style={styles.tabCard}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "scheduled" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("scheduled")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "scheduled" && styles.activeTabText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Scheduled
              </Text>
              {schedule.deliveries.filter((d) => d.status === "scheduled")
                .length > 0 && (
                <View style={[styles.tabBadge, styles.tabBadgeWarning]}>
                  <Text style={styles.tabBadgeText}>
                    {
                      schedule.deliveries.filter(
                        (d) => d.status === "scheduled"
                      ).length
                    }
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "delivered" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("delivered")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "delivered" && styles.activeTabText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Delivered
              </Text>
              {schedule.deliveries.filter((d) => d.status === "delivered")
                .length > 0 && (
                <View style={[styles.tabBadge, styles.tabBadgeSuccess]}>
                  <Text style={styles.tabBadgeText}>
                    {
                      schedule.deliveries.filter(
                        (d) => d.status === "delivered"
                      ).length
                    }
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "undelivered" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("undelivered")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "undelivered" && styles.activeTabText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Undelivered
              </Text>
              {schedule.deliveries.filter((d) => d.status === "failed").length >
                0 && (
                <View style={[styles.tabBadge, styles.tabBadgeError]}>
                  <Text style={styles.tabBadgeText}>
                    {
                      schedule.deliveries.filter((d) => d.status === "failed")
                        .length
                    }
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </GlassCard>
      )}

      {filteredDeliveries.length > 0 ? (
        <GlassCard style={styles.deliveriesCard}>
          <Text style={styles.cardTitle}>
            {activeTab === "scheduled"
              ? "Scheduled Deliveries"
              : activeTab === "delivered"
              ? "Delivered"
              : "Undelivered"}
          </Text>
          {filteredDeliveries.map((delivery, index) => {
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
                    {delivery.reason && (
                      <View style={styles.reasonContainer}>
                        <Ionicons
                          name="information-circle-outline"
                          size={14}
                          color={COLORS.textSecondary}
                          style={styles.reasonIcon}
                        />
                        <Text style={styles.reasonText} numberOfLines={2}>
                          {delivery.reason}
                        </Text>
                      </View>
                    )}
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
                  <View style={styles.quickActionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.quickActionButton,
                        styles.quickActionButtonSuccess,
                      ]}
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
                    <TouchableOpacity
                      style={[
                        styles.quickActionButton,
                        styles.quickActionButtonError,
                      ]}
                      onPress={() => handleQuickMarkUndelivered(delivery)}
                      disabled={submitting}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={COLORS.error}
                      />
                      <Text
                        style={[
                          styles.quickActionText,
                          styles.quickActionTextError,
                        ]}
                      >
                        Mark Undelivered
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </GlassCard>
      ) : schedule && schedule.deliveries.length > 0 ? (
        <GlassCard style={styles.deliveriesCard}>
          <EmptyState
            icon={
              activeTab === "scheduled"
                ? "calendar-outline"
                : activeTab === "delivered"
                ? "checkmark-circle-outline"
                : "close-circle-outline"
            }
            title={
              activeTab === "scheduled"
                ? "No Scheduled Deliveries"
                : activeTab === "delivered"
                ? "No Delivered Deliveries"
                : "No Undelivered Deliveries"
            }
            description={`No ${activeTab} deliveries for ${formatDate(
              selectedDate
            )}`}
          />
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
        onRequestClose={() => {
          setShowUpdateModal(false);
          setDeliveryReason("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
                      onPress={() => {
                        setDeliveryStatus(status.value);
                        // Clear reason when status changes to delivered or scheduled (optional UX)
                        if (
                          status.value === "delivered" ||
                          status.value === "scheduled"
                        ) {
                          setDeliveryReason("");
                        }
                      }}
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

                <Text style={styles.inputLabel}>
                  Reason (Optional)
                  {deliveryStatus === "failed" && (
                    <Text style={styles.requiredIndicator}> *</Text>
                  )}
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={
                    deliveryStatus === "failed"
                      ? "Enter reason for failed delivery (e.g., customer not available)"
                      : "Add any notes or reason for this status change"
                  }
                  value={deliveryReason}
                  onChangeText={(text) => {
                    if (text.length <= 500) {
                      setDeliveryReason(text);
                    }
                  }}
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                  textAlignVertical="top"
                />
                {deliveryReason.length > 0 && (
                  <Text style={styles.characterCount}>
                    {deliveryReason.length}/500 characters
                  </Text>
                )}

                <View style={styles.modalButtons}>
                  <View style={styles.modalButton}>
                    <GlassButton
                      title="Cancel"
                      onPress={() => {
                        setShowUpdateModal(false);
                        setDeliveryReason("");
                      }}
                      variant="outline"
                      style={{ width: "100%" }}
                    />
                  </View>
                  <View style={styles.modalButton}>
                    <GlassButton
                      title={submitting ? "Updating..." : "Update"}
                      onPress={handleUpdateDelivery}
                      disabled={submitting}
                      style={{ width: "100%" }}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Mark as Undelivered Modal */}
      <Modal
        visible={showUndeliveredModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowUndeliveredModal(false);
          setUndeliveredReason("");
          setSelectedDelivery(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mark as Undelivered</Text>

            {selectedDelivery && (
              <>
                <Text style={styles.modalLabel}>Customer:</Text>
                <Text style={styles.modalValue}>
                  {selectedDelivery.user_name}
                </Text>

                <Text style={styles.inputLabel}>
                  Reason <Text style={styles.requiredIndicator}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter reason for undelivered delivery (e.g., customer not available, address issue)"
                  value={undeliveredReason}
                  onChangeText={(text) => {
                    if (text.length <= 500) {
                      setUndeliveredReason(text);
                    }
                  }}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  textAlignVertical="top"
                />
                {undeliveredReason.length > 0 && (
                  <Text style={styles.characterCount}>
                    {undeliveredReason.length}/500 characters
                  </Text>
                )}

                <View style={styles.modalButtons}>
                  <View style={styles.modalButton}>
                    <GlassButton
                      title="Cancel"
                      onPress={() => {
                        setShowUndeliveredModal(false);
                        setUndeliveredReason("");
                        setSelectedDelivery(null);
                      }}
                      variant="outline"
                      style={{ width: "100%" }}
                      size="small"
                    />
                  </View>
                  <View style={styles.modalButton}>
                    <GlassButton
                      title={submitting ? "Updating..." : "Mark Undelivered"}
                      onPress={handleMarkUndelivered}
                      disabled={submitting || !undeliveredReason.trim()}
                      style={styles.modalButtonFullWidth}
                      textStyle={styles.modalButtonText}
                      size="small"
                    />
                  </View>
                </View>
              </>
            )}
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
  dateCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  datePickerButton: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
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
  reasonContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: SPACING.xs,
    padding: SPACING.xs,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  reasonIcon: {
    marginRight: SPACING.xs,
    marginTop: 2,
  },
  reasonText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    flex: 1,
    fontStyle: "italic",
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
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
  textArea: {
    minHeight: 80,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  characterCount: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    textAlign: "right",
    marginTop: SPACING.xs,
  },
  requiredIndicator: {
    color: COLORS.error,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
    gap: SPACING.md,
    alignItems: "stretch",
  },
  modalButton: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
  },
  modalButtonFullWidth: {
    width: "100%",
    paddingHorizontal: SPACING.xs,
  },
  modalButtonText: {
    fontSize: 11,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  tabCard: {
    marginBottom: SPACING.md,
  },
  tabContainer: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
    minWidth: 0, // Allow flex to shrink
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 12,
    flexShrink: 1,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  tabBadge: {
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    flexShrink: 0, // Prevent badge from shrinking
  },
  tabBadgeSuccess: {
    backgroundColor: COLORS.success,
  },
  tabBadgeWarning: {
    backgroundColor: COLORS.warning,
  },
  tabBadgeError: {
    backgroundColor: COLORS.error,
  },
  tabBadgeText: {
    ...TYPOGRAPHY.labelSmall,
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  quickActionButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: SPACING.sm,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  quickActionButtonSuccess: {
    backgroundColor: COLORS.success + "10",
    borderColor: COLORS.success + "30",
  },
  quickActionButtonError: {
    backgroundColor: COLORS.error + "10",
    borderColor: COLORS.error + "30",
  },
  quickActionText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.success,
    fontWeight: "600",
  },
  quickActionTextError: {
    color: COLORS.error,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { subscriptionService } from "../../services/subscription";
import { Subscription } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import {
  formatDate,
  formatLiters,
  getCurrentActiveRate,
} from "../../utils/formatting";

export const SubscriptionScreen: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateSubscriptionModal, setShowUpdateSubscriptionModal] =
    useState(false);
  const [dailyLiters, setDailyLiters] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startDateObj, setStartDateObj] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [milkType, setMilkType] = useState<"buffalo" | "cow">("buffalo");
  const [newDailyLiters, setNewDailyLiters] = useState("");
  const [updateMilkType, setUpdateMilkType] = useState<"buffalo" | "cow">(
    "buffalo"
  );
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const [effectiveFrom, setEffectiveFrom] = useState(
    getTomorrowDate().toISOString().split("T")[0]
  );
  const [effectiveFromDate, setEffectiveFromDate] = useState(getTomorrowDate());
  const [showEffectiveFromPicker, setShowEffectiveFromPicker] = useState(false);
  const [effectiveFromError, setEffectiveFromError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const loadSubscription = async () => {
    try {
      const sub = await subscriptionService.getSubscription();
      console.log("🔍 sub", sub);
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

  useEffect(() => {
    loadSubscription();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSubscription();
  };

  const handleCreateSubscription = async () => {
    if (!dailyLiters || !startDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await subscriptionService.createSubscription({
        daily_liters: dailyLiters,
        subscription_start_date: startDate,
        milk_type: milkType,
      });
      Alert.alert("Success", "Subscription created successfully!");
      setShowCreateModal(false);
      setDailyLiters("");
      setMilkType("buffalo");
      loadSubscription();
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create subscription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubscription = async () => {
    setSubmitting(true);
    try {
      await subscriptionService.updateSubscription({
        milk_type: updateMilkType,
      });
      Alert.alert("Success", "Subscription updated successfully!");
      setShowUpdateSubscriptionModal(false);
      loadSubscription();
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update subscription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }

    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        Alert.alert(
          "Invalid Date",
          "Start date cannot be in the past. Please select today or a future date."
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

  const handleEffectiveFromChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEffectiveFromPicker(false);
    }

    if (selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      if (selected < tomorrow) {
        setEffectiveFromError("Effective date must be from tomorrow onwards");
        Alert.alert(
          "Invalid Date",
          "Effective date must be from tomorrow onwards. You cannot change the daily liters for today."
        );
        return;
      }

      setEffectiveFromDate(selectedDate);
      setEffectiveFrom(selectedDate.toISOString().split("T")[0]);
      setEffectiveFromError("");
    }
  };

  const handleUpdateRate = async () => {
    if (!newDailyLiters || !effectiveFrom) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate date again before submitting - must be from tomorrow onwards
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const selectedDate = new Date(effectiveFrom);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      setEffectiveFromError("Effective date must be from tomorrow onwards");
      Alert.alert(
        "Invalid Date",
        "Effective date must be from tomorrow onwards. You cannot change the daily liters for today."
      );
      return;
    }

    setSubmitting(true);
    try {
      await subscriptionService.updateRate({
        new_daily_liters: newDailyLiters,
        effective_from: effectiveFrom,
      });
      Alert.alert("Success", "Subscription rate updated successfully!");
      setShowUpdateModal(false);
      setNewDailyLiters("");
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      setEffectiveFrom(tomorrowDate.toISOString().split("T")[0]);
      setEffectiveFromDate(tomorrowDate);
      setEffectiveFromError("");
      loadSubscription();
    } catch (error: any) {
      console.error("Error updating rate:", error);
      const errorMessage =
        error.response?.data?.effective_from?.[0] ||
        error.response?.data?.error ||
        "Failed to update subscription rate";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading subscription..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!subscription ? (
        <GlassCard style={styles.noSubscriptionCard}>
          <EmptyState
            icon="water-outline"
            title="No Active Subscription"
            description="Create a subscription to start receiving milk deliveries"
          />
          <GlassButton
            title="Create Subscription"
            onPress={() => {
              setMilkType("buffalo");
              setShowCreateModal(true);
            }}
            style={styles.createButton}
          />
        </GlassCard>
      ) : (
        <>
          <GlassCard style={styles.subscriptionCard}>
            <Text style={styles.cardTitle}>Current Subscription</Text>
            <View style={styles.subscriptionInfo}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.infoLabel}>Quantity:</Text>
                <Text style={styles.infoValue}>
                  {formatLiters(
                    getCurrentActiveRate(
                      subscription.rate_history || [],
                      subscription.current_rate
                    )
                  )}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color={COLORS.secondary} />
                <Text style={styles.infoLabel}>Start Date:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(subscription.subscription_start_date)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name={
                    subscription.is_active ? "checkmark-circle" : "pause-circle"
                  }
                  size={20}
                  color={
                    subscription.is_active ? COLORS.success : COLORS.warning
                  }
                />
                <Text style={styles.infoLabel}>Status:</Text>
                <Text
                  style={[
                    styles.infoValue,
                    subscription.is_active && styles.activeStatus,
                  ]}
                >
                  {subscription.is_active ? "Active" : "Inactive"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="water" size={20} color={COLORS.accent} />
                <Text style={styles.infoLabel}>Milk Type:</Text>
                <Text style={styles.infoValue}>
                  {subscription.milk_type === "buffalo"
                    ? "Buffalo Milk"
                    : "Cow Milk"}
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.rateCard}>
            <Text style={styles.cardTitle}>Rate History</Text>
            {subscription.rate_history &&
            subscription.rate_history.length > 0 ? (
              subscription.rate_history.map((rate, index) => (
                <View key={rate.id} style={styles.rateItem}>
                  <View style={styles.rateInfo}>
                    <Text style={styles.rateValue}>
                      {formatLiters(rate.daily_liters)}
                    </Text>
                    <Text style={styles.rateDate}>
                      {formatDate(rate.effective_from)} -{" "}
                      {rate.effective_to
                        ? formatDate(rate.effective_to)
                        : "Present"}
                    </Text>
                  </View>
                  <Ionicons
                    name={rate.is_active ? "checkmark-circle" : "time"}
                    size={20}
                    color={
                      rate.is_active ? COLORS.success : COLORS.textTertiary
                    }
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noHistoryText}>
                No rate history available
              </Text>
            )}
          </GlassCard>

          <GlassCard style={styles.actionCard}>
            <Text style={styles.cardTitle}>Manage Subscription</Text>
            <GlassButton
              title="Update Daily Amount"
              onPress={() => setShowUpdateModal(true)}
              style={styles.actionButton}
            />
            {/* <GlassButton
              title="Update Milk Type"
              onPress={() => {
                setUpdateMilkType(subscription.milk_type);
                setShowUpdateSubscriptionModal(true);
              }}
              variant="outline"
              style={styles.actionButton}
            /> */}
          </GlassCard>
        </>
      )}

      {/* Create Subscription Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Subscription</Text>

            <Text style={styles.inputLabel}>Daily Liters</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2.5"
              placeholderTextColor={COLORS.textTertiary}
              value={dailyLiters}
              onChangeText={setDailyLiters}
              keyboardType="decimal-pad"
            />

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
                        minimumDate={new Date()}
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
                    minimumDate={new Date()}
                  />
                )}
              </View>
            )}

            <Text style={styles.inputLabel}>Milk Type</Text>
            <View style={styles.milkTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.milkTypeOption,
                  milkType === "buffalo" && styles.milkTypeOptionActive,
                ]}
                onPress={() => setMilkType("buffalo")}
              >
                <Ionicons
                  name={
                    milkType === "buffalo"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={
                    milkType === "buffalo"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.milkTypeText,
                    milkType === "buffalo" && styles.milkTypeTextActive,
                  ]}
                >
                  Buffalo Milk
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.milkTypeOption,
                  milkType === "cow" && styles.milkTypeOptionActive,
                ]}
                onPress={() => setMilkType("cow")}
              >
                <Ionicons
                  name={
                    milkType === "cow" ? "radio-button-on" : "radio-button-off"
                  }
                  size={20}
                  color={
                    milkType === "cow" ? COLORS.primary : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.milkTypeText,
                    milkType === "cow" && styles.milkTypeTextActive,
                  ]}
                >
                  Cow Milk
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowCreateModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <GlassButton
                title="Create"
                onPress={handleCreateSubscription}
                loading={submitting}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Rate Modal */}
      <Modal
        visible={showUpdateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Daily Amount</Text>

            <Text style={styles.inputLabel}>New Daily Liters</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 3.0"
              placeholderTextColor={COLORS.textTertiary}
              value={newDailyLiters}
              onChangeText={setNewDailyLiters}
              keyboardType="decimal-pad"
            />

            <Text style={styles.inputLabel}>Effective From</Text>
            <TouchableOpacity
              onPress={() => setShowEffectiveFromPicker(true)}
              style={styles.datePickerButton}
            >
              <View style={styles.datePickerContent}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.datePickerIcon}
                />
                <Text
                  style={[
                    styles.datePickerText,
                    effectiveFromError && styles.datePickerTextError,
                  ]}
                >
                  {effectiveFrom || "Select date"}
                </Text>
              </View>
            </TouchableOpacity>
            {effectiveFromError ? (
              <Text style={styles.errorText}>{effectiveFromError}</Text>
            ) : null}
            {showEffectiveFromPicker && (
              <View style={styles.datePickerContainer}>
                {Platform.OS === "ios" ? (
                  <>
                    <View style={styles.datePickerHeader}>
                      <Text style={styles.datePickerHeaderText}>
                        Select Effective Date
                      </Text>
                    </View>
                    <View style={styles.datePickerWrapper}>
                      <DateTimePicker
                        value={effectiveFromDate}
                        mode="date"
                        display="spinner"
                        onChange={handleEffectiveFromChange}
                        minimumDate={getTomorrowDate()}
                        textColor={COLORS.text}
                        themeVariant="light"
                        style={styles.datePicker}
                        locale="en_US"
                      />
                    </View>
                    <View style={styles.iosPickerButtons}>
                      <TouchableOpacity
                        onPress={() => setShowEffectiveFromPicker(false)}
                        style={styles.iosPickerButton}
                      >
                        <Text style={styles.iosPickerButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowEffectiveFromPicker(false);
                        }}
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
                    value={effectiveFromDate}
                    mode="date"
                    display="default"
                    onChange={handleEffectiveFromChange}
                    minimumDate={getTomorrowDate()}
                  />
                )}
              </View>
            )}

            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowUpdateModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <GlassButton
                title="Update"
                onPress={handleUpdateRate}
                loading={submitting}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Subscription Modal */}
      <Modal
        visible={showUpdateSubscriptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUpdateSubscriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Milk Type</Text>

            <Text style={styles.inputLabel}>Select Milk Type</Text>
            <View style={styles.milkTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.milkTypeOption,
                  updateMilkType === "buffalo" && styles.milkTypeOptionActive,
                ]}
                onPress={() => setUpdateMilkType("buffalo")}
              >
                <Ionicons
                  name={
                    updateMilkType === "buffalo"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={
                    updateMilkType === "buffalo"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.milkTypeText,
                    updateMilkType === "buffalo" && styles.milkTypeTextActive,
                  ]}
                >
                  Buffalo Milk
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.milkTypeOption,
                  updateMilkType === "cow" && styles.milkTypeOptionActive,
                ]}
                onPress={() => setUpdateMilkType("cow")}
              >
                <Ionicons
                  name={
                    updateMilkType === "cow"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={
                    updateMilkType === "cow"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.milkTypeText,
                    updateMilkType === "cow" && styles.milkTypeTextActive,
                  ]}
                >
                  Cow Milk
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowUpdateSubscriptionModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <GlassButton
                title="Update"
                onPress={handleUpdateSubscription}
                loading={submitting}
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
    paddingBottom: SPACING.xl + 80, // Extra padding for tab bar
  },
  subscriptionCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subscriptionInfo: {
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  activeStatus: {
    color: COLORS.success,
  },
  rateCard: {
    marginBottom: SPACING.lg,
  },
  rateItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  rateInfo: {
    flex: 1,
  },
  rateValue: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.text,
  },
  rateDate: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  noHistoryText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: SPACING.md,
  },
  actionCard: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
  noSubscriptionCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
  },
  createButton: {
    marginTop: SPACING.lg,
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
    fontWeight: "700",
  },
  inputLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    borderWidth: 2,
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
  datePickerTextError: {
    color: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
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
  milkTypeContainer: {
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  milkTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  milkTypeOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundSecondary,
  },
  milkTypeText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  milkTypeTextActive: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

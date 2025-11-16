import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { skipRequestService } from "../../services/skipRequests";
import { SkipRequest } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate, formatSkipReason } from "../../utils/formatting";
import { SKIP_REASONS } from "../../utils/constants";

export const SkipRequestScreen: React.FC = () => {
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(
    getTomorrowDate()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [skipRequests, setSkipRequests] = useState<SkipRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadSkipRequests = async () => {
    try {
      setLoading(true);
      // Get skip requests for current month
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      const requests = await skipRequestService.getSkipRequests(
        startDate,
        endDate
      );
      setSkipRequests(requests);
    } catch (error: any) {
      console.error("Error loading skip requests:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load skip requests"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSkipRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSkipRequests();
  };

  const validateAndSetDate = (dateToValidate: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const selected = new Date(dateToValidate);
    selected.setHours(0, 0, 0, 0);

    if (selected < tomorrow) {
      setDateError("Skip date must be from tomorrow onwards");
      Alert.alert(
        "Invalid Date",
        "Skip date must be from tomorrow onwards. You cannot skip today's delivery."
      );
      return false;
    }

    setSelectedDateObj(dateToValidate);
    setSelectedDate(dateToValidate.toISOString().split("T")[0]);
    setDateError("");
    return true;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      // Update the date object as user changes it
      setSelectedDateObj(selectedDate);
      // Validate and set the date string only when user confirms (Done button or Android selection)
      if (Platform.OS === "android") {
        validateAndSetDate(selectedDate);
      }
    }
  };

  const handleDonePress = () => {
    // When Done is clicked, validate and set the currently displayed date
    if (validateAndSetDate(selectedDateObj)) {
      setShowDatePicker(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date");
      return;
    }

    // Validate date again before submitting - must be from tomorrow onwards
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected < tomorrow) {
      setDateError("Skip date must be from tomorrow onwards");
      Alert.alert(
        "Invalid Date",
        "Skip date must be from tomorrow onwards. You cannot skip today's delivery."
      );
      return;
    }

    if (!selectedReason) {
      Alert.alert("Error", "Please select a reason");
      return;
    }

    setSubmitting(true);
    try {
      await skipRequestService.createSkipRequest({
        skip_date: selectedDate,
        reason: selectedReason as any,
        notes: notes || undefined,
      });
      Alert.alert("Success", "Skip request created successfully!");
      setSelectedDate("");
      setSelectedDateObj(getTomorrowDate());
      setSelectedReason("");
      setNotes("");
      setDateError("");
      loadSkipRequests();
    } catch (error: any) {
      console.error("Error creating skip request:", error);
      const errorMessage =
        error.response?.data?.skip_date?.[0] ||
        error.response?.data?.error ||
        "Failed to create skip request";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && skipRequests.length === 0) {
    return <LoadingSpinner message="Loading skip requests..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <GlassCard style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={24} color={COLORS.info} />
          <Text style={styles.infoTitle}>Skip Delivery</Text>
        </View>
        <Text style={styles.infoText}>
          You can skip your delivery up to 6 PM the day before. Requests after
          this time cannot be processed.
        </Text>
      </GlassCard>

      <GlassCard style={styles.dateCard}>
        <Text style={styles.cardTitle}>Select Date</Text>
        <TouchableOpacity
          onPress={() => {
            // Ensure we have a default date (tomorrow) when opening picker
            if (!selectedDate) {
              const tomorrow = getTomorrowDate();
              setSelectedDateObj(tomorrow);
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
            <Text
              style={[
                styles.datePickerText,
                dateError && styles.datePickerTextError,
              ]}
            >
              {selectedDate || "Select date (tomorrow onwards)"}
            </Text>
          </View>
        </TouchableOpacity>
        {dateError ? (
          <Text style={styles.errorText}>{dateError}</Text>
        ) : (
          <Text style={styles.inputHint}>
            Select a date from tomorrow onwards to skip delivery
          </Text>
        )}
        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            {Platform.OS === "ios" ? (
              <>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerHeaderText}>
                    Select Skip Date
                  </Text>
                </View>
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={selectedDateObj}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={getTomorrowDate()}
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
                minimumDate={getTomorrowDate()}
              />
            )}
          </View>
        )}
      </GlassCard>

      <GlassCard style={styles.reasonCard}>
        <Text style={styles.cardTitle}>Reason for Skipping</Text>
        <View style={styles.reasonList}>
          {SKIP_REASONS.map((reason) => (
            <View
              key={reason.value}
              style={[
                styles.reasonItem,
                selectedReason === reason.value && styles.selectedReason,
              ]}
              onTouchEnd={() => setSelectedReason(reason.value)}
            >
              <Ionicons
                name={
                  reason.value === "traveling"
                    ? "airplane-outline"
                    : reason.value === "excess_stock"
                    ? "archive-outline"
                    : reason.value === "health"
                    ? "medical-outline"
                    : "ellipsis-horizontal-outline"
                }
                size={20}
                color={
                  selectedReason === reason.value
                    ? COLORS.primary
                    : COLORS.textTertiary
                }
              />
              <Text
                style={[
                  styles.reasonText,
                  selectedReason === reason.value && styles.selectedReasonText,
                ]}
              >
                {reason.label}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.notesCard}>
        <Text style={styles.cardTitle}>Additional Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any additional information..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholderTextColor={COLORS.textTertiary}
          textAlignVertical="top"
        />
      </GlassCard>

      <GlassButton
        title="Submit Skip Request"
        onPress={handleSubmit}
        disabled={!selectedDate || !selectedReason || submitting}
        loading={submitting}
        style={styles.submitButton}
      />

      {skipRequests.length > 0 && (
        <GlassCard style={styles.historyCard}>
          <Text style={styles.cardTitle}>Recent Skip Requests</Text>
          {skipRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestDate}>
                  {formatDate(request.skip_date)}
                </Text>
                <Text style={styles.requestReason}>
                  {formatSkipReason(request.reason)}
                </Text>
                {request.notes && (
                  <Text style={styles.requestNotes}>{request.notes}</Text>
                )}
              </View>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.success}
              />
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
    paddingBottom: SPACING.xl + 80, // Extra padding for tab bar
  },
  infoCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.info + "10",
    borderColor: COLORS.info + "30",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.info,
    marginLeft: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 22,
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
  datePickerTextError: {
    color: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  inputHint: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
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
  reasonCard: {
    marginBottom: SPACING.lg,
  },
  reasonList: {
    gap: SPACING.sm,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedReason: {
    backgroundColor: COLORS.primary + "10",
    borderColor: COLORS.primary,
  },
  reasonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  selectedReasonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  notesCard: {
    marginBottom: SPACING.lg,
  },
  notesInput: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    minHeight: 80,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
  historyCard: {
    marginTop: SPACING.lg,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  requestInfo: {
    flex: 1,
  },
  requestDate: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  requestReason: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  requestNotes: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },
});

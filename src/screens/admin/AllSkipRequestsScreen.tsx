import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
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
import { AdminSkipRequest } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate, formatSkipReason } from "../../utils/formatting";

export const AllSkipRequestsScreen: React.FC = () => {
  const [skipRequests, setSkipRequests] = useState<AdminSkipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  };
  const [startDate, setStartDate] = useState(() => {
    return getDefaultStartDate().toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [startDateObj, setStartDateObj] = useState<Date>(getDefaultStartDate());
  const [endDateObj, setEndDateObj] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const loadSkipRequests = async () => {
    try {
      setLoading(true);
      const requests = await adminService.getAllSkipRequests(
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

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }

    if (selectedDate) {
      setStartDateObj(selectedDate);
      // On Android, update immediately
      if (Platform.OS === "android") {
        const dateString = selectedDate.toISOString().split("T")[0];
        setStartDate(dateString);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }

    if (selectedDate) {
      setEndDateObj(selectedDate);
      // On Android, update immediately
      if (Platform.OS === "android") {
        const dateString = selectedDate.toISOString().split("T")[0];
        setEndDate(dateString);
      }
    }
  };

  const handleStartDateDone = () => {
    const dateString = startDateObj.toISOString().split("T")[0];
    setStartDate(dateString);
    setShowStartDatePicker(false);
  };

  const handleEndDateDone = () => {
    const dateString = endDateObj.toISOString().split("T")[0];
    setEndDate(dateString);
    setShowEndDatePicker(false);
  };

  const handleDateRangeChange = () => {
    // Update dates from date objects if on iOS
    let finalStartDate = startDate;
    let finalEndDate = endDate;

    if (Platform.OS === "ios") {
      finalStartDate = startDateObj.toISOString().split("T")[0];
      finalEndDate = endDateObj.toISOString().split("T")[0];
    }

    // Validate that end date is not before start date
    const start = new Date(finalStartDate);
    const end = new Date(finalEndDate);
    if (end < start) {
      Alert.alert(
        "Invalid Date Range",
        "End date cannot be before start date. Please select a valid date range."
      );
      return;
    }

    setStartDate(finalStartDate);
    setEndDate(finalEndDate);
    setShowDateRangeModal(false);
    setLoading(true);
    loadSkipRequests();
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
      <GlassCard style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.cardTitle}>Skip Requests Summary</Text>
          <GlassButton
            title="Filter Dates"
            onPress={() => {
              // Sync date objects with current date strings when opening modal
              if (startDate) {
                const start = new Date(startDate);
                if (!isNaN(start.getTime())) {
                  setStartDateObj(start);
                }
              }
              if (endDate) {
                const end = new Date(endDate);
                if (!isNaN(end.getTime())) {
                  setEndDateObj(end);
                }
              }
              setShowDateRangeModal(true);
            }}
            variant="outline"
            style={styles.filterButton}
          />
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Requests:</Text>
          <Text style={styles.summaryValue}>{skipRequests.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date Range:</Text>
          <Text style={styles.summaryValue}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        </View>
      </GlassCard>

      {skipRequests.length > 0 ? (
        <GlassCard style={styles.requestsCard}>
          <Text style={styles.cardTitle}>Skip Requests</Text>
          {skipRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{request.user_name}</Text>
                <Text style={styles.requestPhone}>{request.user_phone}</Text>
                <View style={styles.requestDetails}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.requestDate}>
                    {formatDate(request.skip_date)}
                  </Text>
                </View>
                <View style={styles.requestDetails}>
                  <Ionicons
                    name="flag-outline"
                    size={14}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.requestReason}>
                    {formatSkipReason(request.reason)}
                  </Text>
                </View>
                {request.notes && (
                  <Text style={styles.requestNotes}>{request.notes}</Text>
                )}
                <View style={styles.requestDetails}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={COLORS.textTertiary}
                  />
                  <Text style={styles.requestTime}>
                    Requested: {formatDate(request.created_at, "MMM dd, HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </GlassCard>
      ) : (
        <GlassCard style={styles.requestsCard}>
          <EmptyState
            icon="calendar-outline"
            title="No Skip Requests"
            description="No skip requests found for the selected date range"
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

            <Text style={styles.inputLabel}>Start Date</Text>
            <TouchableOpacity
              onPress={() => {
                if (!startDate) {
                  setStartDateObj(getDefaultStartDate());
                }
                setShowStartDatePicker(true);
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
                  {startDate
                    ? formatDate(startDate, "EEEE, MMMM dd, yyyy")
                    : "Select start date"}
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
              onPress={() => {
                if (!endDate) {
                  setEndDateObj(new Date());
                }
                setShowEndDatePicker(true);
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
                  {endDate
                    ? formatDate(endDate, "EEEE, MMMM dd, yyyy")
                    : "Select end date"}
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
  filterButton: {
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
  requestsCard: {
    marginBottom: SPACING.lg,
  },
  requestItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  requestPhone: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  requestDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  requestDate: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.primary,
  },
  requestReason: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },
  requestNotes: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },
  requestTime: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
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
  const [selectedDate, setSelectedDate] = useState<string>("");
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

  const handleSubmit = async () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date");
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
      setSelectedReason("");
      setNotes("");
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
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD (e.g., 2025-11-03)"
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholderTextColor={COLORS.textTertiary}
        />
        <Text style={styles.inputHint}>
          Select a future date to skip delivery
        </Text>
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
  dateInput: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: SPACING.md,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputHint: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
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

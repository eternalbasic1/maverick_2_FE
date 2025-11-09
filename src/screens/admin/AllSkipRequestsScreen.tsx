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
} from "react-native";
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
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

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

  const handleDateRangeChange = () => {
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
            onPress={() => setShowDateRangeModal(true)}
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
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

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

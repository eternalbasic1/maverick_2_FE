import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const SkipRequestScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");

  const reasons = [
    { value: "traveling", label: "Traveling", icon: "airplane-outline" },
    { value: "excess_stock", label: "Excess Stock", icon: "archive-outline" },
    { value: "health", label: "Health Issues", icon: "medical-outline" },
    { value: "other", label: "Other", icon: "ellipsis-horizontal-outline" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
        <View style={styles.dateSelector}>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
          <Text style={styles.dateText}>Choose a date to skip</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.reasonCard}>
        <Text style={styles.cardTitle}>Reason for Skipping</Text>
        <View style={styles.reasonList}>
          {reasons.map((reason) => (
            <View
              key={reason.value}
              style={[
                styles.reasonItem,
                selectedReason === reason.value && styles.selectedReason,
              ]}
            >
              <Ionicons
                name={reason.icon as any}
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
        <View style={styles.notesInput}>
          <Text style={styles.notesPlaceholder}>
            Add any additional information...
          </Text>
        </View>
      </GlassCard>

      <GlassButton
        title="Submit Skip Request"
        onPress={() => {}}
        disabled={!selectedDate || !selectedReason}
        style={styles.submitButton}
      />
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
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
  },
  dateText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
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
    justifyContent: "center",
  },
  notesPlaceholder: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textTertiary,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

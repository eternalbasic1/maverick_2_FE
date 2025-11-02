import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const DeliveryScheduleScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GlassCard style={styles.dateCard}>
        <Text style={styles.cardTitle}>Select Date</Text>
        <View style={styles.dateSelector}>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
          <Text style={styles.dateText}>September 28, 2024</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Delivery Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Deliveries:</Text>
          <Text style={styles.summaryValue}>25</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Liters:</Text>
          <Text style={styles.summaryValue}>62.5 L</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Completed:</Text>
          <Text style={[styles.summaryValue, styles.completed]}>20</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pending:</Text>
          <Text style={[styles.summaryValue, styles.pending]}>5</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.deliveriesCard}>
        <Text style={styles.cardTitle}>Delivery List</Text>
        <View style={styles.deliveryItem}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryName}>John Doe</Text>
            <Text style={styles.deliveryPhone}>+91 98765 43210</Text>
            <Text style={styles.deliveryAmount}>2.5 L</Text>
          </View>
          <View style={styles.deliveryStatus}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.statusText}>Delivered</Text>
          </View>
        </View>
        <View style={styles.deliveryItem}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryName}>Jane Smith</Text>
            <Text style={styles.deliveryPhone}>+91 98765 43211</Text>
            <Text style={styles.deliveryAmount}>3.0 L</Text>
          </View>
          <View style={styles.deliveryStatus}>
            <Ionicons name="time" size={20} color={COLORS.warning} />
            <Text style={styles.statusText}>In Progress</Text>
          </View>
        </View>
        <View style={styles.deliveryItem}>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryName}>Mike Johnson</Text>
            <Text style={styles.deliveryPhone}>+91 98765 43212</Text>
            <Text style={styles.deliveryAmount}>2.0 L</Text>
          </View>
          <View style={styles.deliveryStatus}>
            <Ionicons name="close-circle" size={20} color={COLORS.error} />
            <Text style={styles.statusText}>Failed</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Bulk Actions</Text>
        <GlassButton
          title="Mark All as Delivered"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <GlassButton
          title="Update Delivery Status"
          onPress={() => {}}
          variant="outline"
          style={styles.actionButton}
        />
        <GlassButton
          title="Export Delivery Report"
          onPress={() => {}}
          variant="secondary"
          style={styles.actionButton}
        />
      </GlassCard>
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
  },
  statusText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  actionsCard: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
});

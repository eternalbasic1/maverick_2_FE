import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const AllSkipRequestsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GlassCard style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Skip Requests Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Requests:</Text>
          <Text style={styles.summaryValue}>8</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pending Approval:</Text>
          <Text style={[styles.summaryValue, styles.pending]}>3</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Approved:</Text>
          <Text style={[styles.summaryValue, styles.approved]}>5</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.requestsCard}>
        <Text style={styles.cardTitle}>Recent Skip Requests</Text>
        <View style={styles.requestItem}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>John Doe</Text>
            <Text style={styles.requestPhone}>+91 98765 43210</Text>
            <Text style={styles.requestDate}>Sep 30, 2024</Text>
            <Text style={styles.requestReason}>Traveling</Text>
          </View>
          <View style={styles.requestStatus}>
            <Ionicons name="time" size={20} color={COLORS.warning} />
            <Text style={styles.statusText}>Pending</Text>
          </View>
        </View>
        <View style={styles.requestItem}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>Jane Smith</Text>
            <Text style={styles.requestPhone}>+91 98765 43211</Text>
            <Text style={styles.requestDate}>Oct 1, 2024</Text>
            <Text style={styles.requestReason}>Excess Stock</Text>
          </View>
          <View style={styles.requestStatus}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.statusText}>Approved</Text>
          </View>
        </View>
        <View style={styles.requestItem}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>Mike Johnson</Text>
            <Text style={styles.requestPhone}>+91 98765 43212</Text>
            <Text style={styles.requestDate}>Oct 2, 2024</Text>
            <Text style={styles.requestReason}>Health Issues</Text>
          </View>
          <View style={styles.requestStatus}>
            <Ionicons name="time" size={20} color={COLORS.warning} />
            <Text style={styles.statusText}>Pending</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Bulk Actions</Text>
        <GlassButton
          title="Approve All Pending"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <GlassButton
          title="Export Skip Requests"
          onPress={() => {}}
          variant="outline"
          style={styles.actionButton}
        />
        <GlassButton
          title="Filter by Date Range"
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
  summaryCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
    marginBottom: SPACING.md,
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
  pending: {
    color: COLORS.warning,
  },
  approved: {
    color: COLORS.success,
  },
  requestsCard: {
    marginBottom: SPACING.lg,
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
  requestName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  requestPhone: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  requestDate: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  requestReason: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    textTransform: "capitalize",
  },
  requestStatus: {
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

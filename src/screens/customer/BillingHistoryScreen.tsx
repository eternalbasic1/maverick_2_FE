import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const BillingHistoryScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GlassCard style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Billing Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Current Month:</Text>
          <Text style={styles.summaryValue}>September 2024</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Days:</Text>
          <Text style={styles.summaryValue}>28 days</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Liters:</Text>
          <Text style={styles.summaryValue}>70.0 L</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={[styles.summaryValue, styles.amount]}>₹2,100</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.breakdownCard}>
        <Text style={styles.cardTitle}>Rate Breakdown</Text>
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownInfo}>
            <Text style={styles.breakdownRate}>2.5 L/day</Text>
            <Text style={styles.breakdownPeriod}>Sep 1 - Sep 15 (15 days)</Text>
          </View>
          <Text style={styles.breakdownAmount}>₹1,125</Text>
        </View>
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownInfo}>
            <Text style={styles.breakdownRate}>2.0 L/day</Text>
            <Text style={styles.breakdownPeriod}>
              Sep 16 - Sep 30 (13 days)
            </Text>
          </View>
          <Text style={styles.breakdownAmount}>₹975</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.historyCard}>
        <Text style={styles.cardTitle}>Recent Bills</Text>
        <View style={styles.billItem}>
          <View style={styles.billInfo}>
            <Text style={styles.billMonth}>August 2024</Text>
            <Text style={styles.billDetails}>30 days • 60.0 L</Text>
          </View>
          <Text style={styles.billAmount}>₹1,800</Text>
        </View>
        <View style={styles.billItem}>
          <View style={styles.billInfo}>
            <Text style={styles.billMonth}>July 2024</Text>
            <Text style={styles.billDetails}>31 days • 62.0 L</Text>
          </View>
          <Text style={styles.billAmount}>₹1,860</Text>
        </View>
        <View style={styles.billItem}>
          <View style={styles.billInfo}>
            <Text style={styles.billMonth}>June 2024</Text>
            <Text style={styles.billDetails}>30 days • 60.0 L</Text>
          </View>
          <Text style={styles.billAmount}>₹1,800</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.actionCard}>
        <Text style={styles.cardTitle}>Export & Share</Text>
        <GlassButton
          title="Download Current Bill"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <GlassButton
          title="Share Bill"
          onPress={() => {}}
          variant="outline"
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
  amount: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primary,
  },
  breakdownCard: {
    marginBottom: SPACING.lg,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownRate: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  breakdownPeriod: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  breakdownAmount: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  historyCard: {
    marginBottom: SPACING.lg,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  billInfo: {
    flex: 1,
  },
  billMonth: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  billDetails: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  billAmount: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  actionCard: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
});

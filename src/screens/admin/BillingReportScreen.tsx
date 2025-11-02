import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const BillingReportScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GlassCard style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Monthly Billing Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Customers:</Text>
          <Text style={styles.summaryValue}>150</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Revenue:</Text>
          <Text style={[styles.summaryValue, styles.revenue]}>₹45,000</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Average per Customer:</Text>
          <Text style={styles.summaryValue}>₹300</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Collection Rate:</Text>
          <Text style={[styles.summaryValue, styles.success]}>95%</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.customersCard}>
        <Text style={styles.cardTitle}>Top Customers by Revenue</Text>
        <View style={styles.customerItem}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>John Doe</Text>
            <Text style={styles.customerPhone}>+91 98765 43210</Text>
            <Text style={styles.customerPeriod}>Sep 1 - Sep 30, 2024</Text>
          </View>
          <Text style={styles.customerAmount}>₹2,100</Text>
        </View>
        <View style={styles.customerItem}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Jane Smith</Text>
            <Text style={styles.customerPhone}>+91 98765 43211</Text>
            <Text style={styles.customerPeriod}>Sep 1 - Sep 30, 2024</Text>
          </View>
          <Text style={styles.customerAmount}>₹1,950</Text>
        </View>
        <View style={styles.customerItem}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Mike Johnson</Text>
            <Text style={styles.customerPhone}>+91 98765 43212</Text>
            <Text style={styles.customerPeriod}>Sep 1 - Sep 30, 2024</Text>
          </View>
          <Text style={styles.customerAmount}>₹1,800</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>Analytics</Text>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Growth Rate:</Text>
          <Text style={[styles.analyticsValue, styles.positive]}>+12.5%</Text>
        </View>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Customer Retention:</Text>
          <Text style={[styles.analyticsValue, styles.success]}>92%</Text>
        </View>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Average Delivery Time:</Text>
          <Text style={styles.analyticsValue}>45 min</Text>
        </View>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Delivery Success Rate:</Text>
          <Text style={[styles.analyticsValue, styles.success]}>96%</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Export & Reports</Text>
        <GlassButton
          title="Generate Monthly Report"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <GlassButton
          title="Export Customer Data"
          onPress={() => {}}
          variant="outline"
          style={styles.actionButton}
        />
        <GlassButton
          title="Download Analytics"
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
  revenue: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primary,
  },
  success: {
    color: COLORS.success,
  },
  customersCard: {
    marginBottom: SPACING.lg,
  },
  customerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  customerPhone: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  customerPeriod: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  customerAmount: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  analyticsCard: {
    marginBottom: SPACING.lg,
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  analyticsLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  analyticsValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  positive: {
    color: COLORS.success,
  },
  actionsCard: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
});

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

export const SubscriptionScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GlassCard style={styles.subscriptionCard}>
        <Text style={styles.cardTitle}>Current Subscription</Text>
        <View style={styles.subscriptionInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="water" size={20} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Daily Amount:</Text>
            <Text style={styles.infoValue}>2.5 Liters</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={COLORS.secondary} />
            <Text style={styles.infoLabel}>Start Date:</Text>
            <Text style={styles.infoValue}>Sep 1, 2024</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, styles.activeStatus]}>Active</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.rateCard}>
        <Text style={styles.cardTitle}>Rate History</Text>
        <View style={styles.rateItem}>
          <View style={styles.rateInfo}>
            <Text style={styles.rateValue}>2.5 L</Text>
            <Text style={styles.rateDate}>Sep 1, 2024 - Present</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
        </View>
        <View style={styles.rateItem}>
          <View style={styles.rateInfo}>
            <Text style={styles.rateValue}>2.0 L</Text>
            <Text style={styles.rateDate}>Aug 1, 2024 - Aug 31, 2024</Text>
          </View>
          <Ionicons name="time" size={20} color={COLORS.textTertiary} />
        </View>
      </GlassCard>

      <GlassCard style={styles.actionCard}>
        <Text style={styles.cardTitle}>Manage Subscription</Text>
        <GlassButton
          title="Update Daily Amount"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <GlassButton
          title="Pause Subscription"
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
  actionCard: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
});

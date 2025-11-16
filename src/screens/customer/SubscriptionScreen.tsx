import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { subscriptionService } from "../../services/subscription";
import { Subscription } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import {
  formatDate,
  formatLiters,
  getCurrentActiveRate,
} from "../../utils/formatting";

export const SubscriptionScreen: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [dailyLiters, setDailyLiters] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newDailyLiters, setNewDailyLiters] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [submitting, setSubmitting] = useState(false);

  const loadSubscription = async () => {
    try {
      const sub = await subscriptionService.getSubscription();
      console.log("🔍 sub", sub);
      setSubscription(sub);
    } catch (error: any) {
      console.error("Error loading subscription:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load subscription data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSubscription();
  };

  const handleCreateSubscription = async () => {
    if (!dailyLiters || !startDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await subscriptionService.createSubscription({
        daily_liters: dailyLiters,
        subscription_start_date: startDate,
      });
      Alert.alert("Success", "Subscription created successfully!");
      setShowCreateModal(false);
      setDailyLiters("");
      loadSubscription();
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create subscription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRate = async () => {
    if (!newDailyLiters || !effectiveFrom) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await subscriptionService.updateRate({
        new_daily_liters: newDailyLiters,
        effective_from: effectiveFrom,
      });
      Alert.alert("Success", "Subscription rate updated successfully!");
      setShowUpdateModal(false);
      setNewDailyLiters("");
      setEffectiveFrom(new Date().toISOString().split("T")[0]);
      loadSubscription();
    } catch (error: any) {
      console.error("Error updating rate:", error);
      const errorMessage =
        error.response?.data?.effective_from?.[0] ||
        error.response?.data?.error ||
        "Failed to update subscription rate";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading subscription..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!subscription ? (
        <GlassCard style={styles.noSubscriptionCard}>
          <EmptyState
            icon="water-outline"
            title="No Active Subscription"
            description="Create a subscription to start receiving milk deliveries"
          />
          <GlassButton
            title="Create Subscription"
            onPress={() => setShowCreateModal(true)}
            style={styles.createButton}
          />
        </GlassCard>
      ) : (
        <>
          <GlassCard style={styles.subscriptionCard}>
            <Text style={styles.cardTitle}>Current Subscription</Text>
            <View style={styles.subscriptionInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="water" size={20} color={COLORS.primary} />
                <Text style={styles.infoLabel}>Daily Amount:</Text>
                <Text style={styles.infoValue}>
                  {formatLiters(
                    getCurrentActiveRate(
                      subscription.rate_history || [],
                      subscription.current_rate
                    )
                  )}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color={COLORS.secondary} />
                <Text style={styles.infoLabel}>Start Date:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(subscription.subscription_start_date)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name={
                    subscription.is_active ? "checkmark-circle" : "pause-circle"
                  }
                  size={20}
                  color={
                    subscription.is_active ? COLORS.success : COLORS.warning
                  }
                />
                <Text style={styles.infoLabel}>Status:</Text>
                <Text
                  style={[
                    styles.infoValue,
                    subscription.is_active && styles.activeStatus,
                  ]}
                >
                  {subscription.is_active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.rateCard}>
            <Text style={styles.cardTitle}>Rate History</Text>
            {subscription.rate_history &&
            subscription.rate_history.length > 0 ? (
              subscription.rate_history.map((rate, index) => (
                <View key={rate.id} style={styles.rateItem}>
                  <View style={styles.rateInfo}>
                    <Text style={styles.rateValue}>
                      {formatLiters(rate.daily_liters)}
                    </Text>
                    <Text style={styles.rateDate}>
                      {formatDate(rate.effective_from)} -{" "}
                      {rate.effective_to
                        ? formatDate(rate.effective_to)
                        : "Present"}
                    </Text>
                  </View>
                  <Ionicons
                    name={rate.is_active ? "checkmark-circle" : "time"}
                    size={20}
                    color={
                      rate.is_active ? COLORS.success : COLORS.textTertiary
                    }
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noHistoryText}>
                No rate history available
              </Text>
            )}
          </GlassCard>

          <GlassCard style={styles.actionCard}>
            <Text style={styles.cardTitle}>Manage Subscription</Text>
            <GlassButton
              title="Update Daily Amount"
              onPress={() => setShowUpdateModal(true)}
              style={styles.actionButton}
            />
          </GlassCard>
        </>
      )}

      {/* Create Subscription Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Subscription</Text>

            <Text style={styles.inputLabel}>Daily Liters</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2.5"
              value={dailyLiters}
              onChangeText={setDailyLiters}
              keyboardType="decimal-pad"
            />

            <Text style={styles.inputLabel}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />

            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowCreateModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <GlassButton
                title="Create"
                onPress={handleCreateSubscription}
                loading={submitting}
                style={styles.modalButton}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>

      {/* Update Rate Modal */}
      <Modal
        visible={showUpdateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Daily Amount</Text>

            <Text style={styles.inputLabel}>New Daily Liters</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 3.0"
              value={newDailyLiters}
              onChangeText={setNewDailyLiters}
              keyboardType="decimal-pad"
            />

            <Text style={styles.inputLabel}>Effective From</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={effectiveFrom}
              onChangeText={setEffectiveFrom}
            />

            <View style={styles.modalButtons}>
              <GlassButton
                title="Cancel"
                onPress={() => setShowUpdateModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <GlassButton
                title="Update"
                onPress={handleUpdateRate}
                loading={submitting}
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
  noHistoryText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: SPACING.md,
  },
  actionCard: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
  noSubscriptionCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
  },
  createButton: {
    marginTop: SPACING.lg,
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

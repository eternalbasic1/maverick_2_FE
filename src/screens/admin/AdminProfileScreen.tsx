import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../context/AuthContext";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { userService } from "../../services/user";
import { User } from "../../types/api";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatDate } from "../../utils/formatting";

export const AdminProfileScreen: React.FC = () => {
  const { logout, updateUser } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const loadProfile = async () => {
    try {
      const profileData = await userService.getProfile();
      setUser(profileData);
      updateUser(profileData); // Update context with fresh data
    } catch (error: any) {
      console.error("Error loading profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to load profile data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setLogoutLoading(true);
              await logout();
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getInitials = (name: string): string => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getRoleDisplay = (role: string): string => {
    return role === "admin" ? "Administrator" : "Customer";
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your administrator account
        </Text>
      </View>

      {/* Profile Card with Avatar */}
      <View style={styles.profileCardWrapper}>
        <GlassCard style={styles.profileCard} allowOverflow={true}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(user.full_name)}
                </Text>
              </View>
              <View style={styles.avatarBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.success}
                />
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.full_name}</Text>
              <View style={styles.roleBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={COLORS.accent}
                />
                <Text style={styles.roleText}>{getRoleDisplay(user.role)}</Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Contact Information */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLabelContainer}>
            <Ionicons
              name="phone-portrait-outline"
              size={18}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoLabel}>Phone Number</Text>
          </View>
          <Text style={styles.infoValue}>{user.phone_number}</Text>
        </View>
      </GlassCard>

      {/* Account Details */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.secondary}
          />
          <Text style={styles.sectionTitle}>Account Details</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLabelContainer}>
            <Ionicons
              name="finger-print-outline"
              size={18}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoLabel}>User ID</Text>
          </View>
          <Text style={styles.infoValueSmall}>{user.id}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <View style={styles.infoLabelContainer}>
            <Ionicons
              name="time-outline"
              size={18}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoLabel}>Timezone</Text>
          </View>
          <Text style={styles.infoValue}>{user.timezone}</Text>
        </View>
      </GlassCard>

      {/* Account Activity */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.accent} />
          <Text style={styles.sectionTitle}>Account Activity</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLabelContainer}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoLabel}>Member Since</Text>
          </View>
          <Text style={styles.infoValue}>
            {formatDate(user.created_at, "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <View style={styles.infoLabelContainer}>
            <Ionicons
              name="refresh-outline"
              size={18}
              color={COLORS.textSecondary}
            />
            <Text style={styles.infoLabel}>Last Updated</Text>
          </View>
          <Text style={styles.infoValue}>
            {formatDate(user.updated_at, "MMMM dd, yyyy")}
          </Text>
        </View>
      </GlassCard>

      {/* Admin Privileges */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={COLORS.accent}
          />
          <Text style={styles.sectionTitle}>Admin Privileges</Text>
        </View>
        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.privilegeText}>Manage delivery schedules</Text>
        </View>
        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.privilegeText}>View all skip requests</Text>
        </View>
        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.privilegeText}>Generate billing reports</Text>
        </View>
        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.privilegeText}>Access admin dashboard</Text>
        </View>
        <View style={styles.privilegeItem}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.privilegeText}>Manage all customers</Text>
        </View>
      </GlassCard>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <GlassButton
          title="Logout"
          onPress={handleLogout}
          loading={logoutLoading}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
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
  header: {
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineLarge,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  profileCardWrapper: {
    marginBottom: SPACING.lg,
  },
  profileCard: {
    padding: SPACING.xl,
    paddingTop: SPACING.xl + 4, // Extra top padding for avatar border
    paddingBottom: SPACING.xl + 4, // Extra bottom padding for badge
  },
  avatarSection: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SPACING.md,
    width: 104, // Account for avatar (100) + border (2*2)
    height: 104,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  avatarText: {
    ...TYPOGRAPHY.displaySmall,
    color: "#FFFFFF",
    fontSize: 30,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 2,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    ...TYPOGRAPHY.headlineLarge,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent + "10",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    gap: SPACING.xs,
  },
  roleText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.accent,
    fontWeight: "600",
  },
  sectionCard: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.text,
  },
  infoItem: {
    paddingVertical: SPACING.md,
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  infoLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.text,
    fontWeight: "600",
    marginLeft: 26, // Align with icon + gap
  },
  infoValueSmall: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    fontWeight: "500",
    marginLeft: 26,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
  privilegeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  privilegeText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    flex: 1,
  },
  logoutSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
});

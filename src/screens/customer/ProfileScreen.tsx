import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useAuthContext } from "../../context/AuthContext";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { COLORS } from "../../theme/colors";

export const ProfileScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuthContext();

  console.log("🔍 ProfileScreen rendered");
  console.log("🔍 User data:", user);

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
              await logout();
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.full_name || "User"}</Text>
            <Text style={styles.userPhone}>{user?.phone_number || ""}</Text>
            <Text style={styles.userEmail}>{user?.email || "No email"}</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>User ID:</Text>
            <Text style={styles.detailValue}>{user?.id || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Role:</Text>
            <Text style={styles.detailValue}>{user?.role || "Customer"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>
              {user?.is_active ? "Active" : "Inactive"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.subscriptionCard}>
          <Text style={styles.sectionTitle}>Subscription</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>
              {user?.subscription_status || "No subscription"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plan:</Text>
            <Text style={styles.detailValue}>
              {user?.subscription_plan || "N/A"}
            </Text>
          </View>
        </GlassCard>

        <View style={styles.logoutContainer}>
          <GlassButton
            title="Logout"
            onPress={handleLogout}
            loading={isLoading}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding for tab bar
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  profileCard: {
    marginBottom: 20,
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  detailsCard: {
    marginBottom: 20,
    padding: 20,
  },
  subscriptionCard: {
    marginBottom: 30,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  logoutContainer: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

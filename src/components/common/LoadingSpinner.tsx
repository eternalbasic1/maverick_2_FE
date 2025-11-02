import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "large",
  color = COLORS.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  message: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: "center",
  },
});

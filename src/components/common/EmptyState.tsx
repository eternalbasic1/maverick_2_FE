import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "document-outline",
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={COLORS.textTertiary} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionText && onAction && (
        <Text style={styles.actionText} onPress={onAction}>
          {actionText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.headlineMedium,
    color: COLORS.text,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
  description: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  actionText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: SPACING.lg,
    textDecorationLine: "underline",
  },
});

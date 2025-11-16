import React from "react";
import { View, StyleSheet, ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from "../../theme/colors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: "light" | "dark";
  borderRadius?: number;
  padding?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  tint = "light",
  borderRadius = BORDER_RADIUS.lg,
  padding = SPACING.md,
}) => {
  // On Android, use solid white background for consistency with iOS
  if (Platform.OS === "android") {
    return (
      <View style={[styles.androidContainer, { borderRadius, padding }, style]}>
        {children}
      </View>
    );
  }

  // On iOS, use glassmorphic effect
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[
          styles.blurView,
          {
            borderRadius,
            padding,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.glassBackground,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.md,
  },
  blurView: {
    flex: 1,
  },
  androidContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
});

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
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
});

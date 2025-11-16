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
  allowOverflow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  tint = "light",
  borderRadius = BORDER_RADIUS.lg,
  padding = SPACING.md,
  allowOverflow = false,
}) => {
  // On Android, use solid background for consistency with iOS
  if (Platform.OS === "android") {
    // Flatten style if it's an array
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...style.filter(Boolean))
      : style || {};

    // Extract backgroundColor from style prop if provided, otherwise use default
    const customBackgroundColor = flatStyle.backgroundColor;
    const androidBackgroundColor = customBackgroundColor || COLORS.surface;

    // Extract borderColor from style prop if provided, otherwise use default
    const customBorderColor = flatStyle.borderColor;
    const androidBorderColor = customBorderColor || COLORS.border;

    // Create style without backgroundColor and borderColor to avoid duplication
    const { backgroundColor, borderColor, ...restStyle } = flatStyle;

    return (
      <View
        style={[
          styles.androidContainer,
          {
            borderRadius,
            padding,
            backgroundColor: androidBackgroundColor,
            borderColor: androidBorderColor,
          },
          restStyle,
        ]}
      >
        {children}
      </View>
    );
  }

  // On iOS, use glassmorphic effect
  return (
    <View
      style={[
        styles.container,
        { borderRadius },
        allowOverflow && styles.containerOverflowVisible,
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[
          styles.blurView,
          {
            borderRadius,
            padding,
          },
          allowOverflow && styles.blurViewOverflowVisible,
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
  containerOverflowVisible: {
    overflow: "visible",
  },
  blurView: {
    flex: 1,
  },
  blurViewOverflowVisible: {
    overflow: "visible",
  },
  androidContainer: {
    borderWidth: 1,
    overflow: "hidden", // Ensure clean edges, no visual artifacts
    // No elevation/shadow on Android to avoid visible padding effect
    // The border provides enough visual separation
  },
});

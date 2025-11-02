import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  COLORS,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
} from "../../theme/colors";

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  intensity?: number;
  tint?: "light" | "dark";
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = "primary",
  size = "medium",
  intensity = 20,
  tint = "light",
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${size}Button`]];

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [
      styles.text,
      styles[`${size}Text`],
      styles[`${variant}Text`],
    ];

    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }

    return baseTextStyle;
  };

  const getBlurTint = () => {
    if (disabled) return "light";
    return tint;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <BlurView
        intensity={intensity}
        tint={getBlurTint()}
        style={styles.blurView}
      >
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  blurView: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },

  // Size variants
  smallButton: {
    minHeight: 36,
  },
  mediumButton: {
    minHeight: 48,
  },
  largeButton: {
    minHeight: 56,
  },

  smallText: {
    ...TYPOGRAPHY.labelMedium,
  },
  mediumText: {
    ...TYPOGRAPHY.labelLarge,
  },
  largeText: {
    ...TYPOGRAPHY.titleMedium,
  },

  // Color variants
  primaryText: {
    color: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.secondary,
  },
  outlineText: {
    color: COLORS.text,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.textDisabled,
  },
});

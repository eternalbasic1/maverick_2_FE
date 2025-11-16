import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  View,
  ActivityIndicator,
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
  loading?: boolean;
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
  loading = false,
  variant = "primary",
  size = "medium",
  intensity = 20,
  tint = "light",
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button, styles[`${size}Button`]];

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

  // Extract paddingHorizontal from style if provided
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style || {};
  const customPaddingHorizontal = flatStyle.paddingHorizontal;

  if (Platform.OS === "android") {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), styles.androidButton, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.androidButtonContent,
            customPaddingHorizontal !== undefined && {
              paddingHorizontal: customPaddingHorizontal,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator
              color={variant === "outline" ? COLORS.text : COLORS[variant]}
              size="small"
            />
          ) : (
            <Text
              style={[getTextStyle(), textStyle]}
              numberOfLines={2}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.8}
            >
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <BlurView
        intensity={intensity}
        tint={getBlurTint()}
        style={[
          styles.blurView,
          customPaddingHorizontal !== undefined && {
            paddingHorizontal: customPaddingHorizontal,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "outline" ? COLORS.text : COLORS[variant]}
            size="small"
          />
        ) : (
          <Text
            style={[getTextStyle(), textStyle]}
            numberOfLines={2}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {title}
          </Text>
        )}
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
    minHeight: 0,
  },
  androidButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  androidButtonContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
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

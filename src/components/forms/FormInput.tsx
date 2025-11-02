import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from "../../theme/colors";

interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  disabled?: boolean;
  maxLength?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = () => {
    const baseStyle = [styles.container];

    if (isFocused) {
      baseStyle.push(styles.focused);
    }

    if (error) {
      baseStyle.push(styles.error);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={getContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? COLORS.primary : COLORS.textTertiary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          maxLength={maxLength}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? COLORS.primary : COLORS.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 48,
  },
  focused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: COLORS.backgroundTertiary,
    borderColor: COLORS.borderLight,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.text,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  errorText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

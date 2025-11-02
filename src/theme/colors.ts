import { TextStyle } from "react-native";

// Professional Milk/Dairy App Color Palette
export const COLORS = {
  // Primary Colors
  primary: "#2563EB", // Professional Blue
  primaryLight: "#3B82F6", // Light Blue
  primaryDark: "#1D4ED8", // Dark Blue

  // Secondary Colors
  secondary: "#059669", // Professional Green
  secondaryLight: "#10B981", // Light Green
  secondaryDark: "#047857", // Dark Green

  // Accent Colors
  accent: "#7C3AED", // Subtle Purple
  accentLight: "#8B5CF6", // Light Purple
  accentDark: "#6D28D9", // Dark Purple

  // Status Colors
  success: "#059669", // Professional Green
  warning: "#D97706", // Professional Orange
  error: "#DC2626", // Professional Red
  info: "#2563EB", // Professional Blue

  // Background System
  background: "#FFFFFF", // Pure White
  backgroundSecondary: "#F8FAFC", // Light Gray
  backgroundTertiary: "#F1F5F9", // Very Light Gray
  surface: "#FFFFFF", // White Cards
  surfaceVariant: "#F8FAFC", // Light Gray Cards
  surfaceContainer: "#F1F5F9", // Container Background

  // Text Hierarchy
  text: "#0F172A", // Dark Slate
  textSecondary: "#475569", // Slate Gray
  textTertiary: "#64748B", // Light Slate
  textDisabled: "#94A3B8", // Disabled Gray

  // Border Colors
  border: "#E2E8F0", // Light Border
  borderLight: "#F1F5F9", // Very Light Border
  borderDark: "#CBD5E1", // Dark Border

  // Glassmorphism Colors
  glassBackground: "rgba(255, 255, 255, 0.1)",
  glassBorder: "rgba(255, 255, 255, 0.2)",
  glassShadow: "rgba(0, 0, 0, 0.1)",

  // Milk-specific Colors
  milkWhite: "#FFF8F0", // Cream White
  milkCream: "#FEF3C7", // Light Cream
  milkGold: "#F59E0B", // Milk Gold
  milkBrown: "#92400E", // Milk Brown

  // Delivery Status Colors
  delivered: "#059669", // Green
  scheduled: "#2563EB", // Blue
  failed: "#DC2626", // Red
  skipped: "#6B7280", // Gray

  // Skip Reason Colors
  traveling: "#3B82F6", // Blue
  excessStock: "#F59E0B", // Orange
  health: "#EF4444", // Red
  other: "#6B7280", // Gray
};

// Typography System
export const TYPOGRAPHY = {
  // Display Typography
  displayLarge: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  displayMedium: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
    letterSpacing: -0.25,
  } as TextStyle,

  displaySmall: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: 0,
  } as TextStyle,

  // Headline Typography
  headlineLarge: {
    fontFamily: "Inter-SemiBold",
    fontSize: 22,
    fontWeight: "600" as const,
    lineHeight: 28,
    letterSpacing: 0,
  } as TextStyle,

  headlineMedium: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 26,
    letterSpacing: 0,
  } as TextStyle,

  headlineSmall: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
    letterSpacing: 0,
  } as TextStyle,

  // Title Typography
  titleLarge: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 22,
    letterSpacing: 0,
  } as TextStyle,

  titleMedium: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  titleSmall: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,

  // Body Typography
  bodyLarge: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
    letterSpacing: 0,
  } as TextStyle,

  bodyMedium: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  } as TextStyle,

  bodySmall: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,

  // Label Typography
  labelLarge: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  labelMedium: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,

  labelSmall: {
    fontFamily: "Inter-Medium",
    fontSize: 10,
    fontWeight: "500" as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  } as TextStyle,

  // Milk-specific Typography
  milkAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.25,
  } as TextStyle,

  deliveryLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  } as TextStyle,

  rateLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
};

// Spacing System
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

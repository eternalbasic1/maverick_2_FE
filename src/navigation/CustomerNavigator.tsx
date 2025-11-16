import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../screens/customer/HomeScreen";
import { SubscriptionScreen } from "../screens/customer/SubscriptionScreen";
import { SkipRequestScreen } from "../screens/customer/SkipRequestScreen";
import { BillingHistoryScreen } from "../screens/customer/BillingHistoryScreen";
import { ProfileScreen } from "../screens/customer/ProfileScreen";
import { COLORS, TYPOGRAPHY, SPACING } from "../theme/colors";

export type CustomerTabParamList = {
  Home: undefined;
  Subscription: undefined;
  SkipRequest: undefined;
  Billing: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export const CustomerNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  console.log("🔍 CustomerNavigator rendered");
  console.log("🔍 ProfileScreen imported:", ProfileScreen);

  // Calculate tab bar height with safe area insets
  const tabBarHeight = 56 + insets.bottom; // Base height + bottom inset

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Subscription":
              iconName = focused ? "water" : "water-outline";
              break;
            case "SkipRequest":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "Billing":
              iconName = focused ? "receipt" : "receipt-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, SPACING.xs),
          paddingTop: SPACING.xs,
          height: tabBarHeight,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          ...TYPOGRAPHY.labelSmall,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: SPACING.xs,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          ...TYPOGRAPHY.headlineSmall,
          color: COLORS.text,
        },
        headerTintColor: COLORS.text,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: "Subscription" }}
      />
      <Tab.Screen
        name="SkipRequest"
        component={SkipRequestScreen}
        options={{ title: "Skip Delivery" }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingHistoryScreen}
        options={{ title: "Billing" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

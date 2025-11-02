import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { AdminDashboardScreen } from "../screens/admin/AdminDashboardScreen";
import { DeliveryScheduleScreen } from "../screens/admin/DeliveryScheduleScreen";
import { AllSkipRequestsScreen } from "../screens/admin/AllSkipRequestsScreen";
import { BillingReportScreen } from "../screens/admin/BillingReportScreen";
import { AdminProfileScreen } from "../screens/admin/AdminProfileScreen";
import { COLORS, TYPOGRAPHY } from "../theme/colors";

export type AdminDrawerParamList = {
  Dashboard: undefined;
  DeliverySchedule: undefined;
  SkipRequests: undefined;
  BillingReport: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

export const AdminNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "grid" : "grid-outline";
              break;
            case "DeliverySchedule":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "SkipRequests":
              iconName = focused ? "list" : "list-outline";
              break;
            case "BillingReport":
              iconName = focused ? "analytics" : "analytics-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "grid-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.textTertiary,
        drawerStyle: {
          backgroundColor: COLORS.surface,
        },
        drawerLabelStyle: {
          ...TYPOGRAPHY.labelLarge,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          ...TYPOGRAPHY.headlineSmall,
          color: COLORS.text,
        },
        headerTintColor: COLORS.text,
      })}
    >
      <Drawer.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          title: "Dashboard",
          drawerLabel: "Dashboard",
        }}
      />
      <Drawer.Screen
        name="DeliverySchedule"
        component={DeliveryScheduleScreen}
        options={{
          title: "Delivery Schedule",
          drawerLabel: "Delivery Schedule",
        }}
      />
      <Drawer.Screen
        name="SkipRequests"
        component={AllSkipRequestsScreen}
        options={{
          title: "Skip Requests",
          drawerLabel: "Skip Requests",
        }}
      />
      <Drawer.Screen
        name="BillingReport"
        component={BillingReportScreen}
        options={{
          title: "Billing Report",
          drawerLabel: "Billing Report",
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={AdminProfileScreen}
        options={{
          title: "Profile",
          drawerLabel: "Profile",
        }}
      />
    </Drawer.Navigator>
  );
};

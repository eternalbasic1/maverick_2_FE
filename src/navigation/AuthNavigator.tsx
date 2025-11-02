import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { SignupScreen } from "../screens/auth/SignupScreen";
import { DebugScreen } from "../screens/DebugScreen";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Debug: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Debug" component={DebugScreen} />
    </Stack.Navigator>
  );
};

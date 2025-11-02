import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { signupWithOTPSchema } from "../../utils/validation";
import { FormInput } from "../../components/forms/FormInput";
import { FormPhoneInputWithCountry } from "../../components/forms/FormPhoneInputWithCountry";
import { GlassButton } from "../../components/glassmorphism/GlassButton";
import { GlassCard } from "../../components/glassmorphism/GlassCard";
import { useAuthContext } from "../../context/AuthContext";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";
import { SignupWithOTPFormData } from "../../types/api";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Signup"
>;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup, signupLoading, verifyPhoneNumber, confirmOTP } =
    useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<SignupWithOTPFormData>({
    resolver: yupResolver(signupWithOTPSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      otp: "",
    },
  });

  const resetForm = () => {
    reset();
    setOtpSent(false);
    setConfirmation(null);
    setSelectedCountry({
      code: "IN",
      name: "India",
      dialCode: "+91",
      flag: "🇮🇳",
    });
  };

  const sendOTP = async () => {
    const formData = getValues();
    if (!formData.phone_number || !formData.name || !formData.password) {
      Alert.alert("Error", "Please fill in all fields first");
      return;
    }

    try {
      setSendingOtp(true);
      const phoneNumber = `${selectedCountry.dialCode}${formData.phone_number}`;

      const result = await verifyPhoneNumber(phoneNumber);
      if (result.success) {
        setConfirmation(result.confirmation);
        setOtpSent(true);
        Alert.alert(
          "OTP Sent! 📱",
          `OTP has been sent to ${phoneNumber}\n\nPlease check your messages and enter the verification code.`
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to send OTP. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOTPAndSignup = async () => {
    const formData = getValues();
    if (!formData.otp || !confirmation) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    try {
      const otpResult = await confirmOTP(confirmation, formData.otp);
      if (!otpResult.success) {
        Alert.alert("Error", otpResult.error || "Invalid OTP");
        return;
      }

      const signupResult = await signup({
        phone_number: `${selectedCountry.dialCode}${formData.phone_number}`,
        full_name: formData.name,
        firebase_id_token: otpResult.firebaseIdToken,
      });

      if (signupResult.success) {
        Alert.alert(
          "Signup Successful! 🎉",
          "Your account has been created successfully. Welcome to MilkSeller!",
          [
            {
              text: "Continue",
              onPress: () => {
                resetForm();
                // Navigation will be handled by the auth context
              },
            },
          ]
        );
      } else {
        Alert.alert("Signup Failed", signupResult.error || "Please try again.");
      }
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Professional Header */}
        <Animated.View
          entering={FadeInUp.delay(100)}
          style={styles.headerSection}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons
                name="shield-checkmark"
                size={32}
                color={COLORS.primary}
              />
            </View>
            <Text style={[styles.appTitle, TYPOGRAPHY.appTitle]}>
              MilkSeller
            </Text>
            <Text style={[styles.appSubtitle, TYPOGRAPHY.appSubtitle]}>
              Professional Milk Delivery Management
            </Text>
          </View>
        </Animated.View>

        {/* Signup Form */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <GlassCard style={styles.formCard}>
            <Text style={styles.formTitle}>Sign Up</Text>

            <View style={styles.form}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    leftIcon="person-outline"
                  />
                )}
              />

              <FormPhoneInputWithCountry
                name="phone_number"
                control={control}
                label="Mobile Number"
                placeholder="Enter your mobile number"
                onCountryChange={setSelectedCountry}
                defaultCountry={selectedCountry}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry={!showPassword}
                    leftIcon="lock-closed-outline"
                    rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirm_password?.message}
                    secureTextEntry={!showConfirmPassword}
                    leftIcon="lock-closed-outline"
                    rightIcon={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    onRightIconPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                )}
              />

              {!otpSent ? (
                <GlassButton
                  title="Send OTP"
                  onPress={sendOTP}
                  disabled={sendingOtp}
                  loading={sendingOtp}
                  style={styles.signupButton}
                />
              ) : (
                <>
                  <Controller
                    control={control}
                    name="otp"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormInput
                        label="Enter OTP"
                        placeholder="Enter 6-digit OTP"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.otp?.message}
                        keyboardType="numeric"
                        leftIcon="keypad-outline"
                      />
                    )}
                  />

                  <GlassButton
                    title="Verify OTP & Create Account"
                    onPress={handleSubmit(verifyOTPAndSignup)}
                    disabled={signupLoading}
                    loading={signupLoading}
                    style={styles.signupButton}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setOtpSent(false);
                      setConfirmation(null);
                    }}
                    style={styles.resendButton}
                  >
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: 60,
  },
  // Header Section
  headerSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoIcon: {
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 30,
    marginBottom: 12,
  },
  appTitle: {
    color: COLORS.text,
    marginBottom: 4,
  },
  appSubtitle: {
    color: COLORS.textSecondary,
  },
  formCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  form: {
    gap: SPACING.md,
  },
  signupButton: {
    marginTop: SPACING.lg,
    borderRadius: 12,
  },
  resendButton: {
    marginTop: SPACING.sm,
    alignItems: "center",
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

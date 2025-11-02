import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme/colors";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface FormPhoneInputWithCountryProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  onCountryChange?: (country: Country) => void;
  defaultCountry?: Country;
}

const countries: Country[] = [
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
];

export const FormPhoneInputWithCountry = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Enter phone number",
  onCountryChange,
  defaultCountry = countries[0],
}: FormPhoneInputWithCountryProps<T>) => {
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(defaultCountry);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
    onCountryChange?.(country);
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleCountrySelect(item)}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.countryCode}>{item.dialCode}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setShowCountryModal(true)}
        >
          <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                value={value || ""}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />
      </View>

      <Modal
        visible={showCountryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setShowCountryModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={renderCountryItem}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  phoneInputContainer: {
    flex: 1,
    position: "relative",
  },
  phoneInput: {
    fontSize: 16,
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 48,
  },
  phoneInputButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  phoneInputPlaceholder: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    width: "90%",
    maxHeight: "70%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  countryList: {
    maxHeight: 300,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  countryCode: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: SPACING.sm,
  },
});

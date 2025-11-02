import * as yup from "yup";

// Phone number validation
export const phoneValidation = yup
  .string()
  .required("Phone number is required")
  .matches(/^[+]?[\d\s\-\(\)]+$/, "Invalid phone number format")
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must not exceed 15 digits");

// Password validation
export const passwordValidation = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password must not exceed 50 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

// Name validation
export const nameValidation = yup
  .string()
  .required("Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must not exceed 50 characters")
  .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

// Daily liters validation
export const dailyLitersValidation = yup
  .string()
  .required("Daily liters is required")
  .test("is-valid-number", "Must be a valid number", (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  })
  .test("min-value", "Must be at least 0.5 liters", (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return num >= 0.5;
  })
  .test("max-value", "Must not exceed 10 liters", (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return num <= 10;
  })
  .test("decimal-places", "Must have at most 2 decimal places", (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return num === Math.round(num * 100) / 100;
  });

// Date validation
export const dateValidation = yup
  .string()
  .required("Date is required")
  .test("is-valid-date", "Must be a valid date", (value) => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  })
  .test("not-past", "Date cannot be in the past", (value) => {
    if (!value) return false;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  });

// Skip reason validation
export const skipReasonValidation = yup
  .string()
  .required("Reason is required")
  .oneOf(["traveling", "excess_stock", "health", "other"], "Invalid reason");

// Notes validation
export const notesValidation = yup
  .string()
  .max(500, "Notes must not exceed 500 characters");

// Login form validation
export const loginValidationSchema = yup.object().shape({
  phone_number: phoneValidation,
  password: yup.string().required("Password is required"),
});

// Signup form validation
export const signupValidationSchema = yup.object().shape({
  full_name: nameValidation,
  phone_number: phoneValidation,
  password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

// Forgot password form validation
export const forgotPasswordValidationSchema = yup.object().shape({
  phone_number: phoneValidation,
  new_password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
});

// OTP validation
export const otpValidation = yup
  .string()
  .required("OTP is required")
  .length(6, "OTP must be 6 digits")
  .matches(/^\d{6}$/, "OTP must contain only numbers");

// Signup with OTP validation
export const signupWithOTPSchema = yup.object().shape({
  name: nameValidation,
  phone_number: phoneValidation,
  password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  otp: otpValidation,
});

// Login with OTP validation
export const loginWithOTPSchema = yup.object().shape({
  phone_number: phoneValidation,
  otp: otpValidation,
});

// Forgot password with OTP validation
export const forgotPasswordWithOTPSchema = yup.object().shape({
  phone_number: phoneValidation,
  otp: otpValidation,
  new_password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
});

// Create subscription validation
export const createSubscriptionValidationSchema = yup.object().shape({
  daily_liters: dailyLitersValidation,
  subscription_start_date: dateValidation,
});

// Update rate validation
export const updateRateValidationSchema = yup.object().shape({
  new_daily_liters: dailyLitersValidation,
  effective_from: dateValidation,
});

// Skip request validation
export const skipRequestValidationSchema = yup.object().shape({
  skip_date: dateValidation,
  reason: skipReasonValidation,
  notes: notesValidation,
});

// Profile update validation
export const profileUpdateValidationSchema = yup.object().shape({
  full_name: nameValidation,
  timezone: yup.string().required("Timezone is required"),
});

// Delivery status validation
export const deliveryStatusValidationSchema = yup.object().shape({
  delivery_date: dateValidation,
  deliveries: yup
    .array()
    .of(
      yup.object().shape({
        user_id: yup.string().required("User ID is required"),
        status: yup
          .string()
          .required("Status is required")
          .oneOf(
            ["scheduled", "delivered", "failed", "skipped"],
            "Invalid status"
          ),
        actual_liters: yup
          .string()
          .test(
            "conditional-required",
            "Actual liters required for delivered status",
            function (value) {
              const status = this.parent.status;
              if (status === "delivered" && !value) {
                return this.createError({
                  message: "Actual liters required for delivered status",
                });
              }
              return true;
            }
          )
          .test("valid-liters", "Must be a valid number", (value) => {
            if (!value) return true; // Optional for non-delivered status
            const num = parseFloat(value);
            return !isNaN(num) && num > 0;
          }),
      })
    )
    .min(1, "At least one delivery is required"),
});

// Utility functions
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Add country code if not present
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return phone;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const formatDailyLiters = (liters: string): string => {
  const num = parseFloat(liters);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

export const validateDailyLiters = (liters: string): boolean => {
  const num = parseFloat(liters);
  return !isNaN(num) && num >= 0.5 && num <= 10.0;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const validateDate = (date: string): boolean => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

export const isFutureDate = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

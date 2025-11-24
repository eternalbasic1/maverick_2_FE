// User and Authentication
export interface User {
  id: string;
  phone_number: string;
  full_name: string;
  timezone: string;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Subscription Management
export interface Subscription {
  id: string;
  is_active: boolean;
  subscription_start_date: string;
  subscription_end_date: string | null;
  milk_type: "buffalo" | "cow";
  current_rate: string;
  rate_history: Rate[];
  created_at: string;
  updated_at: string;
}

export interface Rate {
  id: string;
  daily_liters: string;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
  created_at: string;
}

// Skip Requests
export interface SkipRequest {
  id: string;
  skip_date: string;
  reason: "traveling" | "excess_stock" | "health" | "other";
  notes?: string;
  created_at: string;
}

// Billing History
export interface BillingHistory {
  billing_period: {
    start_date: string;
    end_date: string;
  };
  total_days_delivered: number;
  total_liters_delivered: number;
  total_amount: number;
  rate_breakdown: RateBreakdown[];
}

export interface RateBreakdown {
  rate_id: string;
  daily_liters: string;
  effective_from: string;
  effective_to: string | null;
  days_delivered: number;
  total_liters: number;
  pricing?: PricingDetails;
}

export interface PricingDetails {
  milk_type: "buffalo" | "cow";
  price_per_liter: string;
  daily_liters: string;
  price_per_day: string;
  pricing_effective_from?: string;
  pricing_effective_to?: string | null;
  days_count: number;
  total_amount: number;
}

// Admin Delivery Schedule
export interface DeliverySchedule {
  date: string;
  total_deliveries: number;
  total_liters: number;
  deliveries: Delivery[];
}

export interface Delivery {
  user_id: string;
  user_name: string;
  user_phone: string;
  scheduled_liters: number;
  rate_id: string;
  status: "scheduled" | "delivered" | "failed" | "skipped";
  reason?: string | null; // Optional reason field for delivery status
}

// Admin Skip Requests
export interface AdminSkipRequest {
  id: string;
  user_name: string;
  user_phone: string;
  skip_date: string;
  reason: "traveling" | "excess_stock" | "health" | "other";
  notes?: string;
  created_at: string;
}

// Admin Billing Report
export interface BillingReport {
  user: {
    id: string;
    name: string;
    phone: string;
  };
  billing_period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_delivered_days: number;
    total_delivered_liters: number;
    total_amount: number;
  };
  total_days_delivered: number;
  total_liters_delivered: number;
  total_amount: number;
  rate_breakdown: DetailedRateBreakdown[];
  deliveries?: BillingDelivery[];
}

export interface BillingDelivery {
  id: string;
  delivery_date: string;
  scheduled_liters: string;
  actual_liters: string;
  status: "scheduled" | "delivered" | "failed" | "skipped";
  rate_applied: string | null;
}

// All Customers Response
export interface AllCustomersResponse {
  count: number;
  customers: User[];
}

export interface DetailedRateBreakdown {
  rate_id: string;
  daily_liters: string;
  effective_from: string;
  effective_to: string | null;
  period_start: string;
  days_delivered: number;
  total_liters: number;
  pricing?: PricingDetails | null;
  period_end: string;
  expected_delivery_days: number;
  actual_delivery_days: number;
  delivered_liters: number;
  delivery_success_rate: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  error: string;
  message?: string;
  status: number;
}

// Form Types
export interface LoginFormData {
  phone_number: string;
  password: string;
}

export interface SignupFormData {
  full_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface ForgotPasswordFormData {
  phone_number: string;
  new_password: string;
  confirm_password: string;
}

// OTP Form Types
export interface LoginWithOTPFormData {
  phone_number: string;
  otp: string;
}

export interface SignupWithOTPFormData {
  name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  otp: string;
}

export interface ForgotPasswordWithOTPFormData {
  phone_number: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}

export interface CreateSubscriptionData {
  daily_liters: string;
  subscription_start_date: string;
  milk_type?: "buffalo" | "cow"; // Optional, defaults to "buffalo" on backend
}

export interface UpdateRateData {
  new_daily_liters: string;
  effective_from: string;
}

export interface UpdateSubscriptionData {
  subscription_end_date?: string | null;
  milk_type?: "buffalo" | "cow";
}

export interface CreateSkipRequestData {
  skip_date: string;
  reason: "traveling" | "excess_stock" | "health" | "other";
  notes?: string;
}

export interface UpdateDeliveryStatusData {
  delivery_date: string;
  deliveries: Array<{
    user_id: string;
    status: "scheduled" | "delivered" | "failed" | "skipped";
    actual_liters?: string;
    reason?: string | null; // Optional reason field for delivery status
  }>;
}

// Subscription response can be either subscription object or error message
export type SubscriptionResponse = Subscription | { message: string };

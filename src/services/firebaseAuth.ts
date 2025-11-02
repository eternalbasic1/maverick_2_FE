import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../config/firebase";

export interface FirebaseAuthResult {
  confirmation: any;
  verificationId: string;
}

export class FirebaseAuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  constructor() {
    console.log("🔥 Firebase Auth Service initialized");
    this.initializeRecaptcha();
  }

  private initializeRecaptcha() {
    try {
      // Create reCAPTCHA verifier like in the HTML version
      this.recaptchaVerifier = new RecaptchaVerifier(auth, {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      });
    } catch (error) {
      console.error("Failed to initialize reCAPTCHA:", error);
      // Create a fallback verifier for React Native
      this.recaptchaVerifier = {
        type: "recaptcha",
        size: "invisible",
        render: () => Promise.resolve("mock-widget-id"),
        verify: () => Promise.resolve("mock-token"),
        clear: () => {},
        reset: () => {},
        _reset: () => {},
        _render: () => Promise.resolve("mock-widget-id"),
        _verify: () => Promise.resolve("mock-token"),
        _clear: () => {},
        "data-theme": "light",
        "data-size": "invisible",
        "data-badge": "bottomright",
        "data-callback": () => {},
        "data-expired-callback": () => {},
        "data-error-callback": () => {},
      } as any;
    }
  }

  // Phone number verification with Firebase (like HTML version)
  async verifyPhoneNumber(phoneNumber: string): Promise<FirebaseAuthResult> {
    try {
      console.log("🔥 Sending OTP to:", phoneNumber);

      if (!this.recaptchaVerifier) {
        throw new Error("reCAPTCHA verifier not initialized");
      }

      // Use signInWithPhoneNumber like in the HTML version
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );

      console.log("✅ OTP sent successfully");

      return {
        confirmation,
        verificationId: confirmation.verificationId,
      };
    } catch (error: any) {
      console.error("❌ Failed to send OTP:", error);
      console.error("❌ Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      throw new Error(error.message || "Failed to send OTP");
    }
  }

  // Confirm OTP and get Firebase token (like HTML version)
  async confirmOTP(
    confirmation: any,
    otpCode: string
  ): Promise<{ firebaseIdToken: string }> {
    try {
      console.log("🔥 Verifying OTP:", otpCode);

      // Verify OTP with Firebase like in HTML version
      const result = await confirmation.confirm(otpCode);
      const firebaseIdToken = await result.user.getIdToken();

      console.log("✅ OTP verified successfully");

      return { firebaseIdToken };
    } catch (error: any) {
      console.error("❌ Failed to verify OTP:", error);
      throw new Error(error.message || "Invalid OTP");
    }
  }

  // Sign out from Firebase
  async signOut(): Promise<void> {
    try {
      await auth.signOut();
      console.log("✅ Signed out successfully");
    } catch (error: any) {
      console.error("❌ Failed to sign out:", error);
      throw new Error(error.message || "Failed to sign out");
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: any) => void) {
    return auth.onAuthStateChanged(callback);
  }

  // Cleanup reCAPTCHA verifier
  cleanup() {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (error) {
        console.error("Error clearing reCAPTCHA:", error);
      }
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();

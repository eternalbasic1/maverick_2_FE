import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXpu2QF0oLoX9z_Sm5Ymow8VmoqMqlFqA",
  authDomain: "chitledger.firebaseapp.com",
  projectId: "chitledger",
  storageBucket: "chitledger.firebasestorage.app",
  messagingSenderId: "317441032251",
  appId: "1:317441032251:web:f76fbd9eea17070da91c1e",
  measurementId: "G-BT5VPH3SST",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  if (error.code === "auth/already-initialized") {
    const { getAuth } = require("firebase/auth");
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { auth };
export default app;

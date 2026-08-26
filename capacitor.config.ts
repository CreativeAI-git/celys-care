import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.celyscare.app",
  appName: "Celys Care",
  webDir: "public",
  backgroundColor: "#0d0a1e",
  server: {
    // Local IP address of your dev machine on Wi-Fi (opens Image 1 on your mobile phone):
    url: process.env.CAPACITOR_SERVER_URL || "http://192.168.1.50:3000",
    cleartext: true,
    androidScheme: "http",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0d0a1e",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0d0a1e",
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
    },
  },
};

export default config;

import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.celyscare.app",
  appName: "Celys Care",
  webDir: "public",
  backgroundColor: "#0d0a1e",
  server: {
    url: process.env.CAPACITOR_SERVER_URL || "https://celyscare.com",
    cleartext: true,
    androidScheme: "https",
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

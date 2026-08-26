import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.celyscare.app",
  appName: "Celys Care",
  webDir: "out",
  backgroundColor: "#0d0a1e",
  server: {
    androidScheme: "https",
    cleartext: false,
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

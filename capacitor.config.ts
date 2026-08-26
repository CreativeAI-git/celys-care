import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.celyscare.app",
  appName: "Celys Care",
  webDir: "public",
  backgroundColor: "#0d0a1e",
  server: {
    // 1. For Android Emulator local testing:
    url: process.env.CAPACITOR_SERVER_URL || "http://10.0.2.2:3000",
    
    // 2. For Real Mobile Phone on same Wi-Fi (Replace with your laptop IP):
    // url: "http://192.168.1.5:3000",
    
    // 3. For Deployed Server (Vercel/Render):
    // url: "https://your-deployed-app.vercel.app",
    
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


import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.245ea7dc47864197baf49be547cfa169',
  appName: 'smart-desk-control-center',
  webDir: 'dist',
  server: {
    url: 'https://245ea7dc-4786-4197-baf4-9be547cfa169.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: "#121212", // Dark theme background
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;

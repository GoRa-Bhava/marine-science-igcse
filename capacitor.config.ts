import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uk.co.marinescience.igcse",
  appName: "Marine Science",
  // Everything in dist/ gets copied inside the APK and loaded from local
  // storage. There is no server and no URL — the app never touches the network.
  webDir: "dist",
  android: {
    backgroundColor: "#04141F",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;

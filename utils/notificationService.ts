import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Simple function to get device token for Android
export async function getDeviceToken(): Promise<string | null> {
  console.log("🔔 Starting device token retrieval...");
  console.log("📱 Platform:", Platform.OS);
  console.log("📱 Is Device:", Device.isDevice);

  try {
    if (!Device.isDevice) {
      console.warn("❌ Push notifications only work on physical devices");
      return null;
    }

    // Request permissions
    console.log("🔐 Requesting notification permissions...");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("🔐 Existing permission status:", existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      console.log("🔐 Requesting new permissions...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("🔐 New permission status:", finalStatus);
    }

    if (finalStatus !== "granted") {
      console.warn("❌ Notification permissions not granted:", finalStatus);
      return null;
    }

    console.log("✅ Permissions granted!");

    // Configure Android channel
    if (Platform.OS === "android") {
      console.log("🤖 Configuring Android notification channel...");
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF7A00",
          enableVibrate: true,
          enableLights: true,
          showBadge: true,
        });
        console.log("✅ Android channel configured");
      } catch (channelError) {
        console.error("❌ Error configuring Android channel:", channelError);
      }
    }

    // Get push token
    console.log("🎫 Getting Expo push token...");
    console.log("🎫 Project ID: aa3019f0-33c3-4d89-bfde-e0cef80729b7");

    let tokenData;
    try {
      // Try with project ID first
      tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "aa3019f0-33c3-4d89-bfde-e0cef80729b7",
      });
      console.log("🎫 Token response (with project ID):", tokenData);
    } catch (projectIdError) {
      console.warn(
        "⚠️ Failed with project ID, trying without...",
        projectIdError
      );
      try {
        // Fallback: try without project ID
        tokenData = await Notifications.getExpoPushTokenAsync();
        console.log("🎫 Token response (without project ID):", tokenData);
      } catch (fallbackError) {
        console.error("❌ Both methods failed:", fallbackError);
        throw fallbackError;
      }
    }

    if (tokenData?.data) {
      await AsyncStorage.setItem("expoPushToken", tokenData.data);
      console.log("✅ Device token obtained and stored:", tokenData.data);
      return tokenData.data;
    }

    console.warn("⚠️ No token data received, trying stored token...");

    // Fallback to stored token
    const storedToken = await AsyncStorage.getItem("expoPushToken");
    if (storedToken) {
      console.log("✅ Using stored token:", storedToken);
      return storedToken;
    }

    console.warn("❌ No token available");
    return null;
  } catch (error) {
    console.error("❌ Error getting device token:", error);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));

    // Try stored token as last resort
    try {
      const storedToken = await AsyncStorage.getItem("expoPushToken");
      if (storedToken) {
        console.log("✅ Using stored token as fallback:", storedToken);
        return storedToken;
      }
    } catch (storageError) {
      console.error("❌ Error getting stored token:", storageError);
    }

    return null;
  }
}

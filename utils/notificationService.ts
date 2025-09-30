import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Alternative method for getting device token (simpler approach)
export async function getDeviceTokenSimple(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      return null;
    }

    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    // Get token without project ID
    const token = await Notifications.getExpoPushTokenAsync();

    if (token?.data) {
      await AsyncStorage.setItem("expoPushToken", token.data);
      return token.data;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Simple function to get device token for Android
export async function getDeviceToken(): Promise<string | null> {
  console.log("🔔 getDeviceToken: Starting...");
  console.log("🔔 Device.isDevice:", Device.isDevice);
  console.log("🔔 Platform.OS:", Platform.OS);

  try {
    if (!Device.isDevice) {
      console.log("🔔 Not a physical device, returning null");
      return null;
    }

    // Request permissions
    console.log("🔔 Requesting permissions...");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("🔔 Existing permission status:", existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      console.log("🔔 Requesting new permissions...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("🔔 New permission status:", finalStatus);
    }

    if (finalStatus !== "granted") {
      console.log("🔔 Permissions not granted:", finalStatus);
      return null;
    }

    console.log("🔔 Permissions granted!");

    // Configure Android channel
    if (Platform.OS === "android") {
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
      } catch (channelError) {
        // Channel configuration failed, but continue
      }
    }

    // Get push token
    console.log("🔔 Getting push token...");
    let tokenData;
    try {
      // Try with project ID first
      console.log("🔔 Trying with project ID...");
      tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "aa3019f0-33c3-4d89-bfde-e0cef80729b7",
      });
      console.log("🔔 Token with project ID:", tokenData);
    } catch (projectIdError) {
      console.log("🔔 Project ID failed:", projectIdError);
      try {
        // Fallback: try without project ID
        console.log("🔔 Trying without project ID...");
        tokenData = await Notifications.getExpoPushTokenAsync();
        console.log("🔔 Token without project ID:", tokenData);
      } catch (fallbackError) {
        console.log("🔔 Both methods failed:", fallbackError);
        throw fallbackError;
      }
    }

    if (tokenData?.data) {
      console.log("🔔 Token data found:", tokenData.data);
      await AsyncStorage.setItem("expoPushToken", tokenData.data);
      return tokenData.data;
    } else {
      console.log("🔔 No token data in response:", tokenData);
    }

    // Fallback to stored token
    const storedToken = await AsyncStorage.getItem("expoPushToken");
    if (storedToken) {
      return storedToken;
    }

    return null;
  } catch (error) {
    // Try stored token as last resort
    try {
      const storedToken = await AsyncStorage.getItem("expoPushToken");
      return storedToken;
    } catch {
      return null;
    }
  }
}

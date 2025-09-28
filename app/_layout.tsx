import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import * as Notifications from "expo-notifications";
import { GlobalProvider } from "../components/globalContext";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF7A00",
        });
      }
    })();
  }, []);
  return (
    <SafeAreaProvider>
      <GlobalProvider>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </GlobalProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(routes)/login/index" />
      <Stack.Screen name="(routes)/verifyOtp/index" />
      <Stack.Screen name="(routes)/profile/index" />
      <Stack.Screen name="(routes)/createPinCode/index" />
      <Stack.Screen name="(routes)/checkPinCode/index" />
      <Stack.Screen name="(routes)/changeNewPinCode/index" />
      <Stack.Screen name="(routes)/changePinCode/index" />
      <Stack.Screen name="(routes)/home/index" />
      <Stack.Screen name="(routes)/loginPinCode/index" />
      <Stack.Screen name="(routes)/terms/index" />
      <Stack.Screen name="(routes)/spinWheels/index" />
      <Stack.Screen name="(routes)/gift/index" />
      <Stack.Screen name="(routes)/giftDetail1/index" />
      <Stack.Screen name="(routes)/giftDetail2/index" />
      <Stack.Screen name="(routes)/giftHistory/index" />
      <Stack.Screen name="(routes)/qrcodeReader/index" />
      <Stack.Screen name="(routes)/notif/index" />
    </Stack>
  );
}

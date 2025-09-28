import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function showLocalNotification(
  title: string,
  body: string,
  delaySeconds: number = 1
) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      type: "timeInterval",
      seconds: delaySeconds,
      repeats: false,
    } as Notifications.TimeIntervalTriggerInput,
  });
}

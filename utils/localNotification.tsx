import * as Notifications from "expo-notifications";

export async function showLocalNotification(
  title: string,
  body: string,
  delaySeconds: number = 1
) {
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

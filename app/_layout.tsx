import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return ( 
      <ToastProvider>
          <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="(routes)/login/index" />
            <Stack.Screen name="(routes)/verifyOtp/index" />
            <Stack.Screen name="(routes)/profile/index" />
            <Stack.Screen name="(routes)/createPinCode/index" />
            <Stack.Screen name="(routes)/checkPinCode/index" />
            <Stack.Screen name="(routes)/changeNewPinCode/index" />
            <Stack.Screen name="(routes)/changePinCode/index" />
            <Stack.Screen name="(routes)/home/index" />
            <Stack.Screen name="(routes)/loginPinCode/index" />
          </Stack>
      </ToastProvider>
  );
}
